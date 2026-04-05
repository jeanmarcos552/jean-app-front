const { execSync } = require("child_process");
const path = require("path");

const keystorePath = path.join(
  __dirname,
  "..",
  "certificados",
  "b2admin.keystore",
);

try {
  console.log(`Verificando keystore em: ${keystorePath}`);
  console.log(
    "A senha padrão geralmente é 'android' ou a senha que você configurou.\n",
  );

  // Utiliza stdio: 'inherit' para permitir que o usuário digite a senha no terminal interativamente
  execSync(`keytool -list -v -keystore "${keystorePath}"`, {
    stdio: "inherit",
  });
} catch (error) {
  console.error(
    "\nErro ao verificar o keystore. Certifique-se de que o Java (keytool) está instalado e nas variáveis de ambiente, e que a senha está correta.",
  );
  console.error("Detalhe:", error.message);
  process.exit(1);
}
