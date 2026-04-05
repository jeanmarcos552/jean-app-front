const { expo } = require("./app.json");
const fs = require("fs");
const path = require("path");

// Plugin customizado para copiar drawables
const withCustomDrawables = (config) => {
  const { withDangerousMod } = require("@expo/config-plugins");

  return withDangerousMod(config, [
    "android",
    async (config) => {
      const drawableSourceDir = path.join(
        config.modRequest.projectRoot,
        "assets",
        "drawable",
      );
      const drawableDestDir = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "src",
        "main",
        "res",
        "drawable",
      );

      // Criar diretório de destino se não existir
      if (!fs.existsSync(drawableDestDir)) {
        fs.mkdirSync(drawableDestDir, { recursive: true });
      }

      // Copiar todos os arquivos .xml da pasta assets/drawable
      if (fs.existsSync(drawableSourceDir)) {
        const files = fs.readdirSync(drawableSourceDir);
        files.forEach((file) => {
          if (file.endsWith(".xml")) {
            const source = path.join(drawableSourceDir, file);
            const dest = path.join(drawableDestDir, file);
            fs.copyFileSync(source, dest);
            console.log(`✅ Copiado drawable: ${file}`);
          }
        });
      }

      return config;
    },
  ]);
};

const withReleaseSigningGradleProperties = (config) => {
  const { withGradleProperties } = require("@expo/config-plugins");

  const ensureProperty = (props, key, value) => {
    const index = props.findIndex(
      (item) => item.type === "property" && item.key === key,
    );

    if (index >= 0) {
      // Nao sobrescreve valor existente (ex.: senha preenchida localmente).
      if (!props[index].value && value) {
        props[index].value = value;
      }
      return;
    }

    props.push({
      type: "property",
      key,
      value,
    });
  };

  return withGradleProperties(config, (config) => {
    ensureProperty(
      config.modResults,
      "MYAPP_UPLOAD_STORE_FILE",
      process.env.MYAPP_UPLOAD_STORE_FILE ||
        "../../certificados/b2admin.keystore",
    );
    ensureProperty(
      config.modResults,
      "MYAPP_UPLOAD_KEY_ALIAS",
      process.env.MYAPP_UPLOAD_KEY_ALIAS || "b2_admin",
    );
    ensureProperty(
      config.modResults,
      "MYAPP_UPLOAD_STORE_PASSWORD",
      process.env.MYAPP_UPLOAD_STORE_PASSWORD || "",
    );
    ensureProperty(
      config.modResults,
      "MYAPP_UPLOAD_KEY_PASSWORD",
      process.env.MYAPP_UPLOAD_KEY_PASSWORD || "",
    );

    return config;
  });
};

const withReleaseSigningBuildGradle = (config) => {
  const { withAppBuildGradle } = require("@expo/config-plugins");

  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== "groovy") {
      return config;
    }

    let contents = config.modResults.contents;

    const signingConfigsStart = contents.indexOf("    signingConfigs {");
    const buildTypesStart = contents.indexOf("    buildTypes {");

    if (signingConfigsStart !== -1 && buildTypesStart !== -1) {
      const signingBlock = contents.slice(signingConfigsStart, buildTypesStart);

      if (!signingBlock.includes("release {")) {
        const releaseSigningBlock = [
          "        release {",
          "            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {",
          "                storeFile file(MYAPP_UPLOAD_STORE_FILE)",
          "                storePassword MYAPP_UPLOAD_STORE_PASSWORD",
          "                keyAlias MYAPP_UPLOAD_KEY_ALIAS",
          "                keyPassword MYAPP_UPLOAD_KEY_PASSWORD",
          "            }",
          "        }",
          "",
        ].join("\n");

        const updatedSigningBlock = signingBlock.replace(
          /\n\s*\}\s*$/,
          `\n${releaseSigningBlock}    }\n`,
        );

        contents =
          contents.slice(0, signingConfigsStart) +
          updatedSigningBlock +
          contents.slice(buildTypesStart);
      }
    }

    // Mantem buildTypes.debug com debug key para desenvolvimento local.
    contents = contents.replace(
      /(buildTypes\s*\{[\s\S]*?debug\s*\{[\s\S]*?)signingConfig\s+signingConfigs\.(debug|release)/,
      "$1signingConfig signingConfigs.debug",
    );

    // Garante buildTypes.release assinado com a release key.
    contents = contents.replace(
      /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig\s+signingConfigs\.(debug|release)/,
      "$1signingConfig signingConfigs.release",
    );

    config.modResults.contents = contents;
    return config;
  });
};

module.exports = () => {
  const iosUrlScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME;

  const plugins = (expo.plugins ?? []).filter((plugin) => {
    if (typeof plugin === "string") {
      return plugin !== "@react-native-google-signin/google-signin";
    }

    return plugin[0] !== "@react-native-google-signin/google-signin";
  });

  if (iosUrlScheme) {
    plugins.push([
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme,
      },
    ]);
  }

  // Adicionar plugin customizado de drawables
  plugins.push(withCustomDrawables);
  plugins.push(withReleaseSigningGradleProperties);
  plugins.push(withReleaseSigningBuildGradle);

  return {
    ...expo,
    plugins,
  };
};
