# 🧠 AI_CONTEXT.md — Módulo de Metas Colaborativas

> Este arquivo define as regras de negócio oficiais do sistema.
> Qualquer implementação (backend, frontend ou integrações) deve seguir estritamente estas diretrizes.

---

# 📌 Visão Geral

O sistema é um **gerenciador de metas colaborativas**, onde múltiplos usuários participam de um objetivo comum, podendo envolver controle financeiro via PIX ou rastreamento de progresso por percentual.

⚠️ IMPORTANTE:

* O sistema **não é custodiante de dinheiro**
* Atua apenas como **coordenador e rastreador de pagamentos**

---

# 👤 Autenticação e Usuário

## Login

* Email + senha
* Google OAuth

## Cadastro obrigatório

* Nome
* Email (único)
* CPF (único)
* Chave PIX

## Cadastro via Google

* Se usuário não existir:
  * Redirecionar para cadastro
  * Pré-preencher nome e email

---

# 🎯 Metas (Goals)

## Estrutura

Campos obrigatórios:

* name
* end_date
* value_type: ["money", "percentage"]
* total_value
* reminder_frequency: ["daily", "weekly", "monthly", "yearly"]

Campos opcionais:

* description
* categories[]

## Sobre `start_date`

* `start_date` é sempre a data de criação da meta (`created_at`)
* Não é um campo separado — usar `created_at` como referência nos cálculos de período

## Sobre `value_type`

* `money`: meta financeira com divisão e parcelas via PIX
  * Exemplo: "Juntar R$10.000 para viagem"
* `percentage`: meta de progresso sem controle financeiro
  * Exemplo: "Treinar 5x por semana", "Perder 10kg em um ano"
  * Nesse tipo: `total_value` representa o alvo percentual (ex: 100%)
  * Não gera parcelas PIX nem TXID
  * Progresso é registrado manualmente pelos participantes

---

# 👥 Participantes

## Regras

* Criador:
  * É automaticamente adicionado como participante com `role = owner` no momento da criação da meta
  * Pode editar meta
  * Pode adicionar/remover participantes
  * É notificado sobre convites recusados

* Participantes (membros):
  * Apenas visualizam
  * Não editam

## Status do participante

* `active`: participando normalmente
* `removed`: removido por inadimplência ou pelo criador
* `invited`: convite pendente de aceite
* `declined`: convite recusado

---

## Convites

### Usuários existentes

* Seleção via busca interna
* Adicionados com status `invited`
* Ao aceitar: status muda para `active`, recálculo é disparado

### Usuários externos

Fluxo:

1. Envio de convite por email
2. Cadastro no app
3. Aceite do convite → adicionado automaticamente como participante ativo

### Aceite de convite

* Ao aceitar (independente do fluxo): participante é **automaticamente adicionado** sem necessidade de aprovação adicional do criador
* Evento `ParticipantAdded` é disparado

### Recusa de convite

* Status do convite muda para `declined`
* Criador é notificado

---

# 💰 Metas Financeiras (`value_type = money`)

## Divisão

Sempre igual entre participantes ativos:

```
valor_por_participante = valor_total / quantidade_participantes_ativos
```

## Parcelas

```
numero_periodos = diferença entre created_at e end_date baseada na frequência
valor_parcela = valor_por_participante / numero_periodos
```

## Arredondamento

* `valor_parcela` deve ser arredondado para 2 casas decimais (centavos)
* Diferença de arredondamento é absorvida pelo criador na última parcela
* Exemplo: R$100 / 3 parcelas = R$33,33 + R$33,33 + R$33,34 (última do criador)

## PIX

* Cada meta usa a chave PIX do criador
* O sistema deve gerar payload PIX (copia e cola / QR Code)
* Apenas metas `money` geram TXID e payload PIX

---

# 💳 Pagamentos (apenas `value_type = money`)

## Controle

✔ Controle AUTOMÁTICO

⚠️ Requisitos:

* Integração futura com provedor PIX
* Uso de webhook para confirmação
* Identificação via TXID único por parcela

## Cálculo de `valor_restante`

Usado no recálculo após inadimplência:

```
valor_restante = total_value - SUM(contributions.amount WHERE status = 'paid')
```

⚠️ Nunca armazenar saldo — sempre calcular via ledger (transactions)

## Estados de pagamento

* `pending`: aguardando pagamento
* `paid`: confirmado via webhook
* `late`: vencido e não pago
* `pending_review`: valor pago diverge do esperado

---

# 🔔 Notificações

## Tipos

* Push
* Email

## Eventos

* Lembrete de pagamento
* Convite recebido
* Convite recusado (para o criador)
* Atraso
* Participante removido por inadimplência (para o grupo)

---

# 🚫 Inadimplência (apenas `value_type = money`)

## Rastreamento

* Campo `late_count` em `goal_participants` armazena o número de atrasos do participante naquela meta
* Incrementado automaticamente quando uma contribuição muda para `late`

## Regra

Se `late_count >= 2`:

### Ações automáticas:

1. Remover participante (`status = removed`)
2. Notificar grupo sobre a remoção
3. Devolver valor pago ao participante (processo externo — responsabilidade do criador)
4. Recalcular meta (disparar `GoalRecalculated`)

## Recálculo

```
valor_restante = total_value - SUM(contributions.amount WHERE status = 'paid')
novo_valor_por_participante = valor_restante / COUNT(participantes_ativos)
```

Atualizar:

* parcelas futuras (somente `status = pending`)
* cronograma (`payment_schedules`)
* valores

## Edge case: participantes insuficientes

Se após remoção restar apenas o criador:

* Meta **não é cancelada automaticamente**
* Criador decide se cancela ou continua sozinho

---

# 💸 Saques

* Não existe saque automático
* Sistema não gerencia retirada de valores

---

# 📊 Estados da Meta

* `active`: em andamento
* `completed`: objetivo atingido
* `cancelled`: cancelada pelo criador

---

# ⚙️ Regras Globais

* Divisão sempre igual entre participantes ativos
* Sem penalidades financeiras
* Sem incentivos
* Usuário pode participar de várias metas
* Meta pode ter vários participantes

---

# ⚠️ Restrições Técnicas IMPORTANTES

## 1. Dinheiro NÃO é controlado pelo sistema

* Apenas rastreamento
* Transferência ocorre fora do app (PIX)

## 2. Devolução NÃO é automatizada

* Responsabilidade do criador

## 3. Controle automático depende de integração PIX

* Sem isso, confirmações devem ser manuais

## 4. Metas `percentage` não geram fluxo financeiro

* Sem parcelas, sem TXID, sem webhook

---

# 🧨 Riscos Conhecidos

* Falta de confiança entre participantes
* Criador pode não devolver valores após remoção
* Falhas na integração PIX podem gerar inconsistência de status

---

# 📌 Decisões de Produto

* Controle de pagamento: automático (via webhook PIX)
* Divisão: igual
* Aceite de convite: automático (sem aprovação adicional)
* Inadimplência: remoção após 2 atrasos
* Recálculo: obrigatório após remoção
* Saque antecipado: não permitido
* `start_date`: sempre `created_at`

---

# 🔄 Regras que NÃO podem ser alteradas sem revisão

* Modelo de divisão igual
* Regra de inadimplência (2 atrasos)
* Sistema não custodial
* Uso de PIX como meio de pagamento
* Aceite de convite = entrada automática na meta

---

# 🧩 Observações para IA

Ao gerar código ou sugerir melhorias:

* Nunca assumir controle financeiro direto
* Sempre considerar recálculo após inadimplência
* Garantir consistência nos valores (arredondamento na última parcela do criador)
* Evitar lógica baseada em saldo armazenado (usar cálculo via ledger)
* Priorizar rastreabilidade (logs / histórico)
* Metas `percentage` não possuem fluxo financeiro — não gerar TXID/PIX para elas
* `late_count` em `goal_participants` é a fonte da verdade para inadimplência

---

# 📍 Status

Versão: 1.2
Estado: Regras fechadas para início de desenvolvimento

---
