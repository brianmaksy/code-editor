import * as esbuild from 'esbuild-wasm';



export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    // for debugging 
    // build is the single argument: the entire bundling process described. 
    setup(build: esbuild.PluginBuild) {
      // replacing if (args.path === 'index.js') root entry file 
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: 'index.js', namespace: 'a' };
      });
      //  replacing if (args.path.includes('./') || args.path.includes('../')) relative files 
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: 'a',
          // reads the "require" statement in the file fetched 
          path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href, // fully formed url 
        };
      });
      // handle main file of a module 
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`, // got args path from newURL (to check)
        };
      });


      // onLoad event - overriding esbuild's attempt to load up index.js in file system 

    },
  };
};