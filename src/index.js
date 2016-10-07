import template from "babel-template";

let buildMagicCurryingGlobalFunction = template(`
  function _magicCurrying(fn) {
    return function _magicCurrying_fn() {
      var params = Array.prototype.slice.call(arguments);
      if (params.length >= fn.length) {
        return fn.apply(this, params);
      }
      return function _magicCurrying() {
        var next = Array.prototype.slice.call(arguments);
        return _magicCurrying_fn.apply(this, params.concat(next));
      };
    };
  }
`);

export default function ({types: t}) {

  const hasDirective = (node, directive) =>
    !! (node.body.directives && node.body.directives.some(({ value }) =>
        value.value == directive
      )
    )

  const getProgram = (path) => t.isProgram(path.node) ? path : getProgram(path.parentPath)

  return {
    visitor: {
      FunctionDeclaration(path) {
        /* All FunctionDeclaration need to be a
          VariableDeclaration of an FunctionExpression */

        let node = path.node;

        if(hasDirective(node, "no curry") ||
           node.id.name === "_magicCurrying") {
          return ; // All is already done
        }

        let fn = t.functionExpression(
          node.id, node.params, node.body,
        );

        let next = t.variableDeclaration("const", [
          t.variableDeclarator(node.id, fn)
        ]);

        path.replaceWith(next);
      },

      FunctionExpression(path) {
        /* All FunctionExpression without a _magicCurrying CallExpression
          will be embraced by it */

        let node = path.node,
            parent = path.parentPath.node;

        if(hasDirective(node, "no curry") ||
           node.id !== null && ( node.id.name === "_magicCurrying" || node.id.name === "_magicCurrying_fn" ) ||
           t.isCallExpression(parent) && parent.callee.name === "_magicCurrying") {
          return ; // All is already done
        }

        let next = t.callExpression(t.identifier("_magicCurrying"), [node]);

        path.replaceWith(next);
      },

      ArrowFunctionExpression(path) {
        /* All ArrowFunctionExpression without a _magicCurrying CallExpression
          will be embraced by it */

        let node = path.node,
            parent = path.parentPath.node;

        if(hasDirective(node, "no curry") ||
           t.isCallExpression(parent) && parent.callee.name === "_magicCurrying") {
          return ; // All is already done
        }

        let next = t.callExpression(t.identifier("_magicCurrying"), [node]);

        path.replaceWith(next);
      },

      CallExpression(path) {
        /* If at least one _magicCurrying CallExpression exist
          we need the _magicCurrying FunctionDeclaration */

        let node = path.node;

        if(node.callee.name !== "_magicCurrying" || path.scope.references["_magicCurrying"]) {
          return ; // All is already done
        }

        const declar = buildMagicCurryingGlobalFunction();
        declar._blockHoist = 3;

        getProgram(path).unshiftContainer("body", [declar]);
      }
    }
  };
}
