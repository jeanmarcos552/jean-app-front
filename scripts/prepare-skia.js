#!/usr/bin/env node

/**
 * Ensures @shopify/react-native-skia has vendored xcframeworks in:
 *   node_modules/@shopify/react-native-skia/libs/{ios,macos,tvos}
 *
 * Expo/RN iOS CocoaPods integration references those paths during build.
 * In some setups (especially when the pod is linked via :path), the podspec
 * prepare_command may not run, leaving libs/ missing and causing linker errors.
 */

const fs = require('fs');
const path = require('path');

function isTruthyEnv(value) {
  if (!value) return false;
  const v = String(value).trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes' || v === 'on';
}

function hasAnyXcframework(dirPath) {
  try {
    return (
      fs.existsSync(dirPath) &&
      fs
        .readdirSync(dirPath, { withFileTypes: true })
        .some((d) => d.isDirectory() && d.name.endsWith('.xcframework'))
    );
  } catch {
    return false;
  }
}

function resolvePackageDir(pkgName) {
  const pkgJson = require.resolve(path.posix.join(pkgName, 'package.json'));
  return path.dirname(pkgJson);
}

function copyXcframeworks({ sourcePackageDir, targetDir }) {
  const sourceLibsDir = path.join(sourcePackageDir, 'libs');
  if (!hasAnyXcframework(sourceLibsDir)) {
    throw new Error(`Skia prebuilt binaries not found in ${sourceLibsDir}`);
  }

  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.mkdirSync(targetDir, { recursive: true });

  const entries = fs.readdirSync(sourceLibsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.endsWith('.xcframework')) continue;
    const from = path.join(sourceLibsDir, entry.name);
    const to = path.join(targetDir, entry.name);
    fs.cpSync(from, to, { recursive: true });
  }
}

function main() {
  const projectRoot = process.cwd();
  const skiaRoot = path.join(projectRoot, 'node_modules', '@shopify', 'react-native-skia');
  const targetBase = path.join(skiaRoot, 'libs');

  const useGraphite = isTruthyEnv(process.env.SK_GRAPHITE);
  const prefix = useGraphite ? 'react-native-skia-graphite' : 'react-native-skia';

  const iosTarget = path.join(targetBase, 'ios');
  const macosTarget = path.join(targetBase, 'macos');

  if (hasAnyXcframework(iosTarget) && hasAnyXcframework(macosTarget)) {
    console.log('[prepare-skia] Skia xcframeworks already present (libs/).');
    return;
  }

  console.log(`[prepare-skia] Preparing Skia xcframeworks (graphite=${useGraphite ? 'on' : 'off'})...`);

  let iosPackageDir;
  let macosPackageDir;
  let tvosPackageDir;
  try {
    iosPackageDir = resolvePackageDir(`${prefix}-apple-ios`);
    macosPackageDir = resolvePackageDir(`${prefix}-apple-macos`);
  } catch (e) {
    console.error('[prepare-skia] ERROR: Could not resolve Skia apple packages.');
    console.error('[prepare-skia] Make sure you ran npm/yarn install successfully.');
    throw e;
  }

  console.log(`[prepare-skia] iOS package:   ${iosPackageDir}`);
  console.log(`[prepare-skia] macOS package: ${macosPackageDir}`);

  copyXcframeworks({ sourcePackageDir: iosPackageDir, targetDir: iosTarget });
  copyXcframeworks({ sourcePackageDir: macosPackageDir, targetDir: macosTarget });

  if (!useGraphite) {
    try {
      tvosPackageDir = resolvePackageDir(`${prefix}-apple-tvos`);
      const tvosTarget = path.join(targetBase, 'tvos');
      console.log(`[prepare-skia] tvOS package: ${tvosPackageDir}`);
      copyXcframeworks({ sourcePackageDir: tvosPackageDir, targetDir: tvosTarget });
    } catch {
      // Optional
    }
  }

  console.log('[prepare-skia] Done.');
}

try {
  main();
} catch (err) {
  console.error(String(err?.stack || err));
  process.exit(1);
}
