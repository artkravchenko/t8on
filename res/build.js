/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const map = require('lodash/map');
const rimraf = require('rimraf');
const rollup = require('rollup');
const RollupPluginBabel = require('rollup-plugin-babel');
const RollupPluginCommonJS = require('rollup-plugin-commonjs');
const RollupPluginReplace = require('rollup-plugin-replace');
const RollupPluginUglify = require('rollup-plugin-uglify');

const merge = require('../src/util/merge');

const buildTargets = {
  CJS: 'CJS',
  ES: 'ES',
  UMD_DEV: 'UMD_DEV',
  UMD_PROD: 'UMD_PROD'
};

const CJS = buildTargets.CJS;
const ES = buildTargets.ES;
const UMD_DEV = buildTargets.UMD_DEV;
const UMD_PROD = buildTargets.UMD_PROD;

function resolve(entryPath) {
  return path.join(__dirname, '../', entryPath);
}

function getOutputOptions(target) {
  const output = {
    exports: 'named',
    sourcemap: false
  };

  switch (target) {
    case UMD_DEV:
      return merge(output, {
        file: 'dist/t8on.js',
        name: 't8on.js',
        format: 'umd'
      });
    case UMD_PROD:
      return merge(output, {
        file: 'dist/t8on.min.js',
        name: 't8on.min.js',
        format: 'umd'
      });
    case CJS:
      return merge(output, {
        file: 'dist/t8on.cjs.js',
        format: 'cjs'
      });
    case ES:
      return merge(output, {
        file: 'dist/t8on.es.js',
        format: 'es'
      });
  }

  return undefined;
}

function stripEnvVariables(production) {
  return {
    'process.env.NODE_ENV': production ? '"production"' : '"development"'
  };
}

function getPlugins(target) {
  const plugins = [
    RollupPluginCommonJS(),
    RollupPluginBabel()
  ];

  switch (target) {
    case UMD_DEV:
      plugins.push(
        RollupPluginReplace(stripEnvVariables(false)),
        // evaluate `process.env.NODE_ENV` and related conditions at compile-time
        RollupPluginUglify({
          compress: {
            dead_code: true,
            evaluate: true,
            if_return: false,
            inline: false,
            loops: false,
            keep_fargs: true,
            keep_fnames: true,
            join_vars: false,
            properties: false,
            reduce_vars: true,
            sequences: false,
            unused: true
          },
          mangle: false,
          output: {
            beautify: true,
            comments: true,
            indent_level: 2,
            keep_quoted_props: true,
            quote_style: 3
          },
          warnings: false
        })
      );
      break;
    case UMD_PROD:
      plugins.push(
        RollupPluginReplace(stripEnvVariables(true)),
        RollupPluginUglify({
          compress: {
            dead_code: true,
            evaluate: true,
            unused: true,
            drop_debugger: true,
            booleans: true
          },
          warnings: false
        })
      );
      break;
  }

  return plugins;
}

function build(target) {
  return rollup
    .rollup({
      input: 'src/index.js',
      plugins: getPlugins(target)
    })
    .then(result => result.write(getOutputOptions(target)))
    .then(() => console.log('COMPLETE'))
    .catch(error => {
      if (error.code) {
        console.error(`-- ${error.code} (${error.plugin}) --`);
        console.error(error.message);
        console.error(error.loc);
        console.error(error.codeFrame);
      } else {
        console.error(error);
      }
      process.exit(1);
    });
}

async function forEachSeq(tasks) {
  for (const task of tasks) {
    await task();
  }
}

return rimraf(resolve('dist'), () => {
  fs.mkdirSync(resolve('dist'));

  const tasks = map(
    buildTargets,
    target => () => build(target)
  );

  return forEachSeq(tasks);
});
