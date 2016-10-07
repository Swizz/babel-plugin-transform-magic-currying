export default function ({types: t}) {
  return {
    visitor: {
      FunctionDeclaration(path) {
        /* All FunctionDeclaration need to be a
          VariableDeclaration of an FunctionExpression */

        let node = path.node;

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

        if(t.isCallExpression(parent) && parent.callee.name === "_magicCurrying") {
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

          if(t.isCallExpression(parent) && parent.callee.name === "_magicCurrying") {
            return ; // All is already done
          }

          let next = t.callExpression(t.identifier("_magicCurrying"), [node]);

          path.replaceWith(next);
      }
    }
  };
}
