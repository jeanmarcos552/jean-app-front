# FRONTEND_INTEGRATION.md — Metas Colaborativas

> Documento de integraciao para o frontend.
> Base URL: `http://localhost:8000/api`
> Toda comunicacao com o backend e feita via JSON.
> Todas as respostas seguem um padrao unico documentado abaixo.

---

## 1. PADRAO DE RESPOSTA DA API

Toda resposta da API segue **exatamente** um destes dois formatos:

### Sucesso

```json
{
  "success": true,
  "data": { ... },
  "message": "string | null"
}
```

### Erro

```json
{
  "success": false,
  "error": {
    "code": "STRING_CONSTANTE",
    "message": "Mensagem legivel para o usuario",
    "details": []
  }
}
```

### Erro de validacao (422)

O Laravel retorna automaticamente erros de validacao neste formato:

```json
{
  "message": "The email field is required.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field must be at least 8 characters."]
  }
}
```

> **IMPORTANTE**: Erros 422 NAO seguem o padrao `success/error`. Tratar separadamente.

### HTTP Status Codes

| Codigo | Significado |
|--------|-------------|
| 200 | Sucesso |
| 201 | Recurso criado |
| 401 | Nao autenticado (token invalido/ausente) |
| 403 | Sem permissao (usuario autenticado mas sem acesso) |
| 404 | Recurso nao encontrado |
| 422 | Erro de validacao |
| 500 | Erro interno do servidor |

---

## 2. AUTENTICACAO

O backend usa **Laravel Sanctum** com tokens Bearer.

### Headers obrigatorios em TODA requisicao

```
Accept: application/json
Content-Type: application/json
```

### Header de autenticacao (rotas protegidas)

```
Authorization: Bearer {token}
```

> O token e retornado pelo Register e Login. Deve ser armazenado de forma segura no frontend (ex: SecureStore no React Native, localStorage na web).

### Fluxo de autenticacao

```
1. Usuario faz Register ou Login
2. API retorna { user, token }
3. Frontend armazena o token
4. Todas as requisicoes protegidas incluem Authorization: Bearer {token}
5. Se API retornar 401 → token expirou/invalido → redirecionar para Login
```

---

## 3. ENDPOINTS — REFERENCIA COMPLETA

---

### 3.1 AUTH

#### POST /auth/register (publico)

**Request:**
```json
{
  "name": "Jean Marcos",
  "email": "jean@test.com",
  "cpf": "123.456.789-00",
  "password": "senha1234",
  "pix_key": "jean@pix.com"
}
```

**Validacao:**
| Campo | Regras |
|-------|--------|
| name | obrigatorio, string |
| email | obrigatorio, email valido, unico |
| cpf | obrigatorio, string, 14 caracteres (com mascara) |
| password | obrigatorio, minimo 8 caracteres |
| pix_key | obrigatorio, string |

> O backend sanitiza o CPF (remove pontos e traco). O frontend pode enviar com ou sem mascara.

**Resposta 201:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "019681a2-...",
      "name": "Jean Marcos",
      "email": "jean@test.com",
      "cpf": "12345678900",
      "pix_key": "jean@pix.com",
      "created_at": "2026-04-05T10:00:00.000000Z",
      "updated_at": "2026-04-05T10:00:00.000000Z"
    },
    "token": "1|abc123def456..."
  },
  "message": "Usuario registrado com sucesso."
}
```

> O campo `password` NUNCA aparece na resposta.

**Erros possiveis:**
| Codigo HTTP | Situacao |
|-------------|----------|
| 422 | Campo invalido (email duplicado, CPF duplicado, senha curta) |

---

#### POST /auth/login (publico)

**Request:**
```json
{
  "email": "jean@test.com",
  "password": "senha1234"
}
```

**Validacao:**
| Campo | Regras |
|-------|--------|
| email | obrigatorio, email valido |
| password | obrigatorio, string |

**Resposta 200:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "019681a2-...",
      "name": "Jean Marcos",
      "email": "jean@test.com",
      "cpf": "12345678900",
      "pix_key": "jean@pix.com",
      "created_at": "2026-04-05T10:00:00.000000Z",
      "updated_at": "2026-04-05T10:00:00.000000Z"
    },
    "token": "2|xyz789..."
  },
  "message": null
}
```

**Erros possiveis:**
| Codigo HTTP | code | Situacao |
|-------------|------|----------|
| 401 | INVALID_CREDENTIALS | Email ou senha invalidos |
| 422 | — | Campos faltando |

---

#### POST /auth/google (publico)

**Request:**
```json
{
  "token": "google_oauth_id_token"
}
```

**Validacao:**
| Campo | Regras |
|-------|--------|
| token | obrigatorio, string |

**Resposta 200 — usuario existente:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "...", "email": "..." },
    "token": "3|..."
  },
  "message": null
}
```

**Resposta 200 — usuario novo (precisa completar cadastro):**
```json
{
  "success": true,
  "data": {
    "needs_registration": true,
    "name": "Nome do Google",
    "email": "email@google.com"
  },
  "message": null
}
```

> **Fluxo frontend para Google Auth:**
> 1. Obter `id_token` do Google Sign-In
> 2. Enviar para `/auth/google`
> 3. Se `needs_registration === true` → redirecionar para tela de cadastro pre-preenchida com `name` e `email`
> 4. Se retornar `token` → usuario ja existe, salvar token e redirecionar para home

**Erros possiveis:**
| Codigo HTTP | code | Situacao |
|-------------|------|----------|
| 401 | INVALID_GOOGLE_TOKEN | Token do Google invalido |

---

#### POST /auth/logout (autenticado)

**Request:** Sem body.

**Resposta 200:**
```json
{
  "success": true,
  "data": null,
  "message": "Logout realizado com sucesso."
}
```

> Apos logout, descartar o token no frontend.

---

#### GET /me (autenticado)

**Resposta 200:**
```json
{
  "success": true,
  "data": {
    "id": "019681a2-...",
    "name": "Jean Marcos",
    "email": "jean@test.com",
    "cpf": "12345678900",
    "pix_key": "jean@pix.com",
    "created_at": "2026-04-05T10:00:00.000000Z",
    "updated_at": "2026-04-05T10:00:00.000000Z"
  },
  "message": null
}
```

> Usar para validar sessao ao abrir o app e para exibir dados do perfil.

---

### 3.2 GOALS (METAS)

#### POST /goals (autenticado)

**Request:**
```json
{
  "name": "Viagem Europa",
  "description": "Juntar para viagem em grupo",
  "end_date": "2027-04-05",
  "value_type": "money",
  "total_value": 1200.00,
  "reminder_frequency": "monthly",
  "categories": ["viagem"]
}
```

**Validacao:**
| Campo | Regras |
|-------|--------|
| name | obrigatorio, string |
| description | opcional, string ou null |
| end_date | obrigatorio, formato YYYY-MM-DD, deve ser data futura |
| value_type | obrigatorio, enum: `money` ou `percentage` |
| total_value | obrigatorio, numerico, minimo 0.01 |
| reminder_frequency | obrigatorio, enum: `daily`, `weekly`, `monthly`, `yearly` |
| categories | obrigatorio, array de strings |

**Resposta 201:**
```json
{
  "success": true,
  "data": {
    "id": "019681b3-...",
    "owner_id": "019681a2-...",
    "name": "Viagem Europa",
    "description": "Juntar para viagem em grupo",
    "end_date": "2027-04-05",
    "value_type": "money",
    "total_value": "1200.00",
    "reminder_frequency": "monthly",
    "status": "active",
    "categories": ["viagem"],
    "created_at": "2026-04-05T10:00:00.000000Z",
    "updated_at": "2026-04-05T10:00:00.000000Z",
    "goal_participants": [
      {
        "id": "019681b4-...",
        "goal_id": "019681b3-...",
        "user_id": "019681a2-...",
        "role": "owner",
        "status": "active",
        "late_count": 0,
        "joined_at": "2026-04-05T10:00:00.000000Z",
        "created_at": "2026-04-05T10:00:00.000000Z",
        "user": {
          "id": "019681a2-...",
          "name": "Jean Marcos",
          "email": "jean@test.com"
        }
      }
    ]
  },
  "message": "Meta criada com sucesso."
}
```

> **Regras de negocio automaticas ao criar:**
> - O criador e automaticamente adicionado como participante com `role: "owner"` e `status: "active"`
> - Se `value_type: "money"` → parcelas sao geradas automaticamente em `contributions`
> - Se `value_type: "percentage"` → NENHUMA parcela e gerada (sem fluxo financeiro)

> **Sobre `value_type` — regra critica para o frontend:**
> - `money` → meta financeira. Exibe: parcelas, PIX, pagamentos, progresso por valor pago
> - `percentage` → meta de progresso. Exibe: progresso manual, sem parcelas, sem PIX
> - `value_type` NAO pode ser alterado apos criacao

---

#### GET /goals (autenticado)

Lista metas onde o usuario e participante ativo.

**Resposta 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "019681b3-...",
      "owner_id": "019681a2-...",
      "name": "Viagem Europa",
      "description": "Juntar para viagem em grupo",
      "end_date": "2027-04-05",
      "value_type": "money",
      "total_value": "1200.00",
      "reminder_frequency": "monthly",
      "status": "active",
      "categories": ["viagem"],
      "created_at": "2026-04-05T10:00:00.000000Z",
      "updated_at": "2026-04-05T10:00:00.000000Z",
      "owner": {
        "id": "019681a2-...",
        "name": "Jean Marcos",
        "email": "jean@test.com"
      }
    }
  ],
  "message": null
}
```

> Filtra automaticamente: so retorna metas com `goal_participants.status = active` para o usuario logado.

---

#### GET /goals/{id} (autenticado, participante)

**Resposta 200:**
```json
{
  "success": true,
  "data": {
    "id": "019681b3-...",
    "owner_id": "019681a2-...",
    "name": "Viagem Europa",
    "description": "Juntar para viagem em grupo",
    "end_date": "2027-04-05",
    "value_type": "money",
    "total_value": "1200.00",
    "reminder_frequency": "monthly",
    "status": "active",
    "categories": ["viagem"],
    "created_at": "2026-04-05T10:00:00.000000Z",
    "updated_at": "2026-04-05T10:00:00.000000Z",
    "owner": {
      "id": "019681a2-...",
      "name": "Jean Marcos",
      "email": "jean@test.com"
    },
    "goal_participants": [
      {
        "id": "...",
        "goal_id": "...",
        "user_id": "...",
        "role": "owner",
        "status": "active",
        "late_count": 0,
        "joined_at": "2026-04-05T10:00:00.000000Z",
        "created_at": "2026-04-05T10:00:00.000000Z",
        "user": {
          "id": "...",
          "name": "Jean Marcos",
          "email": "jean@test.com"
        }
      }
    ]
  },
  "message": null
}
```

**Erros possiveis:**
| Codigo HTTP | code | Situacao |
|-------------|------|----------|
| 403 | FORBIDDEN | Usuario nao e participante da meta |
| 404 | — | Meta nao existe |

---

#### PUT /goals/{id} (autenticado, apenas owner)

**Request (todos os campos sao opcionais):**
```json
{
  "name": "Viagem Europa 2027",
  "description": "Descricao atualizada",
  "end_date": "2027-06-01",
  "total_value": 1500.00,
  "reminder_frequency": "weekly",
  "categories": ["viagem", "lazer"]
}
```

> **IMPORTANTE**: `value_type` NAO pode ser enviado/alterado. O backend ignora esse campo.

**Resposta 200:**
```json
{
  "success": true,
  "data": { "...goal atualizada..." },
  "message": "Meta atualizada com sucesso."
}
```

**Erros possiveis:**
| Codigo HTTP | code | Situacao |
|-------------|------|----------|
| 403 | FORBIDDEN | Nao e o criador |
| 404 | — | Meta nao existe |
| 422 | — | Validacao |

---

#### DELETE /goals/{id} (autenticado, apenas owner)

Cancela a meta (soft delete — muda `status` para `cancelled`).

**Request:** Sem body.

**Resposta 200:**
```json
{
  "success": true,
  "data": null,
  "message": "Meta cancelada com sucesso."
}
```

**Erros possiveis:**
| Codigo HTTP | code | Situacao |
|-------------|------|----------|
| 403 | FORBIDDEN | Nao e o criador |
| 404 | — | Meta nao existe |

---

### 3.3 PARTICIPANTS (PARTICIPANTES)

#### POST /goals/{goalId}/participants (autenticado, apenas owner)

Adiciona usuario existente como participante (status inicial: `invited`).

**Request:**
```json
{
  "user_id": "019681a2-..."
}
```

**Validacao:**
| Campo | Regras |
|-------|--------|
| user_id | obrigatorio, UUID, deve existir na tabela users |

**Resposta 201:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "goal_id": "...",
    "user_id": "...",
    "role": "member",
    "status": "invited",
    "late_count": 0,
    "joined_at": null,
    "created_at": "2026-04-05T10:00:00.000000Z"
  },
  "message": "Participante convidado com sucesso."
}
```

**Erros possiveis:**
| Codigo HTTP | code | Situacao |
|-------------|------|----------|
| 403 | FORBIDDEN | Nao e o criador |
| 422 | ALREADY_PARTICIPANT | Usuario ja e participante ou ja foi convidado |

---

#### DELETE /goals/{goalId}/participants/{userId} (autenticado, apenas owner)

Remove participante manualmente.

**Request:** Sem body.

**Resposta 200:**
```json
{
  "success": true,
  "data": null,
  "message": "Participante removido com sucesso."
}
```

> **Efeitos colaterais automaticos (backend):**
> - Parcelas pendentes do participante sao canceladas
> - Parcelas dos demais participantes sao recalculadas
> - Todos os participantes ativos sao notificados

**Erros possiveis:**
| Codigo HTTP | code | Situacao |
|-------------|------|----------|
| 403 | FORBIDDEN | Nao e o criador |
| 422 | CANNOT_REMOVE_OWNER | Tentou remover o criador |
| 404 | — | Participante nao encontrado ou nao esta ativo |

---

### 3.4 INVITES (CONVITES)

#### POST /goals/{goalId}/invite (autenticado, apenas owner)

Envia convite por email.

**Request:**
```json
{
  "email": "convidado@test.com"
}
```

**Validacao:**
| Campo | Regras |
|-------|--------|
| email | obrigatorio, email valido |

**Resposta 201:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "goal_id": "...",
    "invited_by": "...",
    "email": "convidado@test.com",
    "token": "abc123def456...",
    "status": "pending",
    "expires_at": "2026-04-12T10:00:00.000000Z",
    "created_at": "2026-04-05T10:00:00.000000Z"
  },
  "message": "Convite enviado com sucesso."
}
```

> Token expira em 7 dias. Se o email pertence a um usuario existente, ele e adicionado como `invited` em `goal_participants` automaticamente.

**Erros possiveis:**
| Codigo HTTP | code | Situacao |
|-------------|------|----------|
| 403 | FORBIDDEN | Nao e o criador |
| 422 | INVITE_ALREADY_SENT | Ja existe convite pendente para esse email |

---

#### POST /invites/{token}/accept (publico)

Aceita convite via token unico.

**Request:** Sem body.

**Resposta 200:**
```json
{
  "success": true,
  "data": null,
  "message": "Convite aceito com sucesso."
}
```

> **Efeitos colaterais automaticos (backend):**
> - Participante ativado (`status: active`)
> - Se meta `money` → parcelas recalculadas para incluir novo participante
> - Broadcast no canal `goal.{goalId}` com evento `participant.added`

**Erros possiveis:**
| Codigo HTTP | code | Situacao |
|-------------|------|----------|
| 404 | INVITE_NOT_FOUND | Token invalido ou ja usado |
| 422 | INVITE_EXPIRED | Convite expirou |
| 422 | USER_NOT_FOUND | Email do convite nao tem conta cadastrada |

---

#### POST /invites/{token}/decline (publico)

Recusa convite.

**Request:** Sem body.

**Resposta 200:**
```json
{
  "success": true,
  "data": null,
  "message": "Convite recusado."
}
```

> O criador da meta recebe notificacao do tipo `invite_declined`.

**Erros possiveis:**
| Codigo HTTP | code | Situacao |
|-------------|------|----------|
| 404 | INVITE_NOT_FOUND | Token invalido ou ja usado |

---

### 3.5 CONTRIBUTIONS (PARCELAS)

> Aplicavel SOMENTE a metas com `value_type: "money"`.
> Metas `percentage` NAO possuem contributions.

#### GET /goals/{goalId}/contributions (autenticado, participante)

Lista contribuicoes da meta.

**Query params opcionais:**
| Param | Tipo | Descricao |
|-------|------|-----------|
| user_id | uuid | Filtrar por participante (apenas owner pode usar) |
| status | string | `pending`, `paid`, `late`, `pending_review` |

> **Regra de visibilidade:**
> - **Owner**: ve TODAS as contribuicoes (pode filtrar por `user_id` e `status`)
> - **Member**: ve SOMENTE as proprias (filtros de `user_id` sao ignorados)

**Resposta 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "goal_id": "...",
      "user_id": "...",
      "installment_no": 1,
      "amount": "100.00",
      "txid": "019681c5-...",
      "status": "pending",
      "due_date": "2026-05-05",
      "paid_at": null,
      "transaction_id": null,
      "generation": 1,
      "created_at": "2026-04-05T10:00:00.000000Z",
      "user": {
        "id": "...",
        "name": "Jean Marcos",
        "email": "jean@test.com"
      }
    }
  ],
  "message": null
}
```

**Erros possiveis:**
| Codigo HTTP | code | Situacao |
|-------------|------|----------|
| 403 | FORBIDDEN | Nao e participante ativo |

---

#### GET /goals/{goalId}/contributions/my (autenticado, participante)

Lista SOMENTE as contribuicoes do usuario logado na meta.

**Resposta 200:** Mesmo formato da listagem acima, sem o objeto `user` aninhado.

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "goal_id": "...",
      "user_id": "...",
      "installment_no": 1,
      "amount": "100.00",
      "txid": "019681c5-...",
      "status": "pending",
      "due_date": "2026-05-05",
      "paid_at": null,
      "transaction_id": null,
      "generation": 1,
      "created_at": "2026-04-05T10:00:00.000000Z"
    }
  ],
  "message": null
}
```

**Erros possiveis:**
| Codigo HTTP | code | Situacao |
|-------------|------|----------|
| 403 | FORBIDDEN | Nao e participante |

---

#### GET /goals/{goalId}/pix/{contributionId} (autenticado, dono da parcela)

Gera payload PIX para pagamento de uma parcela.

**Resposta 200:**
```json
{
  "success": true,
  "data": {
    "pix_copy_paste": "PIX:jean@pix.com|VALOR:100.00|TXID:019681c5-...|DESC:Meta: Viagem Europa - Parcela 1",
    "qr_code_base64": "UElYOmplYW5AcGl4LmNvbXxWQUxPUjoxMDAuMDA...",
    "amount": "100.00",
    "due_date": "2026-05-05",
    "txid": "019681c5-..."
  },
  "message": null
}
```

> **Para o frontend:**
> - `pix_copy_paste` → botao "Copiar codigo PIX" (copiar para clipboard)
> - `qr_code_base64` → renderizar como imagem: `<img src="data:image/png;base64,{qr_code_base64}" />`
> - `amount` e `due_date` → exibir na tela de pagamento
> - Nao disponivel para parcelas com `status: "paid"`

**Erros possiveis:**
| Codigo HTTP | code | Situacao |
|-------------|------|----------|
| 422 | NOT_MONEY_GOAL | Meta nao e financeira |
| 422 | ALREADY_PAID | Parcela ja paga |
| 404 | — | Parcela nao encontrada ou nao pertence ao usuario |

---

### 3.6 NOTIFICATIONS (NOTIFICACOES)

#### GET /notifications (autenticado)

**Query params opcionais:**
| Param | Tipo | Descricao |
|-------|------|-----------|
| unread | boolean | `true` para filtrar apenas nao lidas |

**Resposta 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "user_id": "...",
      "type": "payment_reminder",
      "payload": {
        "goal_id": "...",
        "goal_name": "Viagem Europa",
        "amount": 100.00,
        "due_date": "2026-05-05"
      },
      "read_at": null,
      "created_at": "2026-04-05T10:00:00.000000Z"
    }
  ],
  "message": null
}
```

> Ordenadas por `created_at` DESC (mais recente primeiro).

---

#### Schemas do `payload` por tipo de notificacao

**payment_reminder:**
```json
{
  "goal_id": "uuid",
  "goal_name": "string",
  "amount": 100.00,
  "due_date": "YYYY-MM-DD"
}
```

**invite:**
```json
{
  "goal_id": "uuid",
  "goal_name": "string",
  "invited_by": "string",
  "token": "string"
}
```

**invite_declined:**
```json
{
  "goal_id": "uuid",
  "goal_name": "string",
  "declined_by_email": "string"
}
```

**late:**
```json
{
  "goal_id": "uuid",
  "goal_name": "string",
  "installment_no": 1,
  "late_count": 1
}
```

**removal:**
```json
{
  "goal_id": "uuid",
  "goal_name": "string",
  "removed_user_name": "string",
  "reason": "defaulter | manual"
}
```

---

#### PATCH /notifications/{id}/read (autenticado)

**Request:** Sem body.

**Resposta 200:**
```json
{
  "success": true,
  "data": null,
  "message": "Notificacao marcada como lida."
}
```

---

#### PATCH /notifications/read-all (autenticado)

**Request:** Sem body.

**Resposta 200:**
```json
{
  "success": true,
  "data": null,
  "message": "Todas as notificacoes marcadas como lidas."
}
```

---

## 4. ENUMS — VALORES VALIDOS

O frontend DEVE usar exatamente estes valores (lowercase):

### GoalStatus
| Valor | Descricao |
|-------|-----------|
| `active` | Meta em andamento |
| `completed` | Meta concluida |
| `cancelled` | Meta cancelada pelo criador |

### ValueType
| Valor | Descricao |
|-------|-----------|
| `money` | Meta financeira com parcelas PIX |
| `percentage` | Meta de progresso sem fluxo financeiro |

### ContributionStatus
| Valor | Descricao |
|-------|-----------|
| `pending` | Aguardando pagamento |
| `paid` | Pago e confirmado |
| `late` | Vencido e nao pago |
| `pending_review` | Valor divergente, revisao manual |

### ParticipantRole
| Valor | Descricao |
|-------|-----------|
| `owner` | Criador da meta (pode editar, convidar, remover) |
| `member` | Participante comum (apenas visualiza) |

### ParticipantStatus
| Valor | Descricao |
|-------|-----------|
| `active` | Participando normalmente |
| `invited` | Convite pendente |
| `declined` | Convite recusado |
| `removed` | Removido (manual ou inadimplencia) |

### ReminderFrequency
| Valor | Descricao |
|-------|-----------|
| `daily` | Diaria |
| `weekly` | Semanal |
| `monthly` | Mensal |
| `yearly` | Anual |

### NotificationType
| Valor | Descricao |
|-------|-----------|
| `payment_reminder` | Lembrete de parcela |
| `invite` | Convite recebido |
| `invite_declined` | Convite recusado (para o criador) |
| `late` | Parcela atrasada |
| `removal` | Participante removido |

---

## 5. REGRAS DE NEGOCIO QUE AFETAM O FRONTEND

### 5.1 Permissoes por role

| Acao | Owner | Member |
|------|-------|--------|
| Editar meta | sim | nao |
| Cancelar meta | sim | nao |
| Adicionar participante | sim | nao |
| Remover participante | sim | nao |
| Enviar convite | sim | nao |
| Ver todas as contribuicoes | sim | apenas as proprias |
| Filtrar contribuicoes por user | sim | nao |
| Gerar PIX da propria parcela | sim | sim |
| Ver detalhes da meta | sim | sim |

> O frontend deve **esconder botoes/acoes** que o usuario nao tem permissao.
> Para saber o role: verificar `goal_participants` onde `user_id === usuario_logado`.

### 5.2 Diferenca entre `money` e `percentage`

| Funcionalidade | money | percentage |
|----------------|-------|------------|
| Parcelas (contributions) | sim | nao |
| PIX (pagamento) | sim | nao |
| TXID | sim | nao |
| Progresso financeiro | soma de `paid` / `total_value` | manual |
| Tela de pagamento | sim | nao |
| Recalculo ao add/remover participante | sim | nao |

> **Regra critica**: nunca exibir botao de PIX ou tela de parcelas para metas `percentage`.

### 5.3 Inadimplencia

- `late_count` no objeto `goal_participants` indica quantos atrasos o participante tem
- Se `late_count >= 2` → participante sera **automaticamente removido** pelo backend
- Frontend pode exibir aviso ao usuario com `late_count === 1`
- Apos remocao, todos os participantes recebem notificacao tipo `removal`

### 5.4 Recalculo automatico

Quando participantes entram ou saem de uma meta `money`:
- O backend recalcula automaticamente os valores de todas as parcelas `pending`
- O frontend deve **recarregar as contribuicoes** apos eventos de add/remove de participante
- O campo `generation` na contribution indica a versao do calculo (incrementa a cada recalculo)

### 5.5 Convite — fluxo completo no frontend

```
FLUXO 1 — Convidar usuario existente (por busca):
  1. Owner busca usuario (futuro endpoint /users/search)
  2. POST /goals/{id}/participants com user_id
  3. Participante fica com status "invited"
  4. Participante aceita via notificacao in-app

FLUXO 2 — Convidar por email:
  1. Owner informa email
  2. POST /goals/{id}/invite
  3. Email enviado com link contendo token
  4. Destinatario clica no link
  5. Se nao tem conta → cadastro → aceita convite
  6. Se tem conta → aceita direto via POST /invites/{token}/accept
  7. Participante ativado automaticamente
```

### 5.6 Formato de datas

| Campo | Formato enviado | Formato recebido |
|-------|----------------|------------------|
| end_date | `YYYY-MM-DD` | `YYYY-MM-DD` |
| due_date | — (readonly) | `YYYY-MM-DD` |
| created_at | — (readonly) | `YYYY-MM-DDTHH:mm:ss.000000Z` (ISO 8601) |
| updated_at | — (readonly) | `YYYY-MM-DDTHH:mm:ss.000000Z` |
| paid_at | — (readonly) | `YYYY-MM-DDTHH:mm:ss.000000Z` ou `null` |
| expires_at | — (readonly) | `YYYY-MM-DDTHH:mm:ss.000000Z` |
| joined_at | — (readonly) | `YYYY-MM-DDTHH:mm:ss.000000Z` ou `null` |
| read_at | — (readonly) | `YYYY-MM-DDTHH:mm:ss.000000Z` ou `null` |

> O timezone do backend e `America/Sao_Paulo`.

### 5.7 IDs

- Todos os IDs sao **UUID v7** (string de 36 caracteres)
- Exemplo: `019681a2-3b4c-7d5e-8f6a-9b0c1d2e3f4a`
- UUID v7 sao ordenados cronologicamente (IDs mais recentes sao "maiores")

### 5.8 Valores monetarios

- Retornados como **string** com 2 casas decimais: `"1200.00"`, `"33.33"`
- Frontend deve converter para numero ao exibir e formatar para BRL: `R$ 1.200,00`
- Enviar para o backend como **numero**: `1200.00`, `33.33`

---

## 6. BROADCAST EVENTS (TEMPO REAL)

O backend dispara eventos via broadcast nos seguintes canais privados:

| Canal | Evento | Payload |
|-------|--------|---------|
| `private-goal.{goalId}` | `payment.confirmed` | `{ contributionId, goalId, userId, txid, amount, timestamp }` |
| `private-goal.{goalId}` | `participant.added` | `{ goalId, userId }` |
| `private-goal.{goalId}` | `participant.removed` | `{ goalId, userId, reason }` |
| `private-goal.{goalId}` | `goal.recalculated` | `{ goalId, generation }` |

> Implementacao de broadcast ainda usa driver `log` (nao configurado para producao).
> Quando habilitado (Laravel Echo + Pusher/Soketi), o frontend deve:
> 1. Assinar o canal `private-goal.{goalId}` ao abrir a tela de detalhes da meta
> 2. Reagir aos eventos atualizando a UI em tempo real
> 3. Desassinar ao sair da tela

---

## 7. CODIGOS DE ERRO DO BACKEND

Referencia completa de todos os `error.code` retornados:

| code | HTTP | Endpoint | Descricao |
|------|------|----------|-----------|
| INVALID_CREDENTIALS | 401 | POST /auth/login | Email ou senha invalidos |
| INVALID_GOOGLE_TOKEN | 401 | POST /auth/google | Token Google invalido |
| FORBIDDEN | 403 | Varios | Sem permissao para a acao |
| GOAL_NOT_FOUND | 404 | GET /goals/{id} | Meta nao encontrada |
| INVITE_NOT_FOUND | 404 | POST /invites/{token}/* | Token invalido/usado |
| INVITE_EXPIRED | 422 | POST /invites/{token}/accept | Convite expirou |
| INVITE_ALREADY_SENT | 422 | POST /goals/{id}/invite | Convite pendente ja existe |
| USER_NOT_FOUND | 422 | POST /invites/{token}/accept | Precisa se cadastrar |
| ALREADY_PARTICIPANT | 422 | POST /goals/{id}/participants | Ja e participante |
| CANNOT_REMOVE_OWNER | 422 | DELETE /goals/{id}/participants/{userId} | Criador nao pode ser removido |
| NOT_MONEY_GOAL | 422 | GET /goals/{id}/pix/{contributionId} | Meta nao e financeira |
| ALREADY_PAID | 422 | GET /goals/{id}/pix/{contributionId} | Parcela ja paga |

---

## 8. CHECKLIST DE INTEGRACAO

### HTTP Client
- [ ] Configurar base URL: `http://localhost:8000/api`
- [ ] Configurar headers padrão: `Accept: application/json`, `Content-Type: application/json`
- [ ] Interceptor para injetar `Authorization: Bearer {token}` em rotas autenticadas
- [ ] Interceptor para tratar resposta 401 → limpar token → redirecionar para login
- [ ] Tratar erros 422 (validacao) parseando o campo `errors`
- [ ] Tratar erros padrao parseando `error.code` e `error.message`

### Auth
- [ ] Tela de Register com campos: name, email, cpf, password, pix_key
- [ ] Tela de Login com campos: email, password
- [ ] Integracao Google Sign-In → POST /auth/google
- [ ] Fluxo de cadastro pre-preenchido quando `needs_registration === true`
- [ ] Armazenar token de forma segura
- [ ] Armazenar user_id para comparacoes locais
- [ ] Funcao de logout → POST /auth/logout → limpar dados locais

### Goals
- [ ] Tela de listagem de metas (GET /goals)
- [ ] Tela de criacao com formulario (POST /goals)
- [ ] Tela de detalhes da meta (GET /goals/{id})
- [ ] Diferenciar UI entre `money` e `percentage`
- [ ] Mostrar/esconder acoes de owner vs member
- [ ] Funcao de editar (PUT /goals/{id}) — apenas owner
- [ ] Funcao de cancelar (DELETE /goals/{id}) — apenas owner

### Participants
- [ ] Lista de participantes na tela de detalhes da meta
- [ ] Botao de adicionar participante (apenas owner)
- [ ] Botao de remover participante (apenas owner, nao pode remover a si mesmo)
- [ ] Exibir `late_count` como indicador de alerta

### Invites
- [ ] Formulario de envio de convite por email (apenas owner)
- [ ] Deep link para aceitar convite: `/invites/{token}/accept`
- [ ] Deep link para recusar convite: `/invites/{token}/decline`
- [ ] Tratar convite expirado

### Contributions (apenas money)
- [ ] Lista de parcelas do usuario (GET /goals/{id}/contributions/my)
- [ ] Lista de todas as parcelas — owner only (GET /goals/{id}/contributions)
- [ ] Tela de pagamento PIX (GET /goals/{id}/pix/{contributionId})
- [ ] Botao "Copiar PIX" usando `pix_copy_paste`
- [ ] Exibir QR Code usando `qr_code_base64`
- [ ] Indicadores visuais por status: pending, paid, late, pending_review
- [ ] NAO exibir secao de parcelas para metas `percentage`

### Notifications
- [ ] Tela/drawer de notificacoes (GET /notifications)
- [ ] Badge de nao lidas (GET /notifications?unread=true + contar)
- [ ] Acao de marcar como lida (PATCH /notifications/{id}/read)
- [ ] Acao de marcar todas como lidas (PATCH /notifications/read-all)
- [ ] Renderizar payload diferente por `type`
- [ ] Navegacao ao clicar: usar `goal_id` do payload para abrir a meta

---

## 9. EXEMPLO COMPLETO DE FLUXO

```
1. CADASTRO
   POST /auth/register → salvar token e user

2. CRIAR META
   POST /goals → salvar goal_id
   (se money: parcelas geradas automaticamente)

3. CONVIDAR AMIGO
   POST /goals/{goal_id}/invite { email: "amigo@test.com" }

4. AMIGO ACEITA
   POST /invites/{token}/accept
   (backend recalcula parcelas automaticamente)

5. VER MINHAS PARCELAS
   GET /goals/{goal_id}/contributions/my

6. PAGAR PARCELA
   GET /goals/{goal_id}/pix/{contribution_id}
   → usuario copia PIX e paga no app do banco
   → webhook confirma pagamento automaticamente
   → status muda para "paid"

7. VERIFICAR PROGRESSO
   GET /goals/{goal_id} → ver participantes e status
   GET /goals/{goal_id}/contributions → ver todas as parcelas (owner)

8. NOTIFICACOES
   GET /notifications → lembrete de pagamento, convites, atrasos
```
