// analyze.js
const acorn = require("acorn");
const walk = require("acorn-walk");

/**
 * Analyzes JavaScript code to find if statements, classes, objects, and functions.
 *
 * @param {string} code - The JavaScript source code
 * @returns {object} - An object with arrays that list the positions of found nodes
 */
function analyzeJavaScript(code) {
  // Parse the code into an AST
  const ast = acorn.parse(code, {
    ecmaVersion: 2020,
    sourceType: "module", // or "script" if you prefer
    locations: true       // include line/column info
  });

  // We'll collect information in these arrays
  const ifStatements = [];
  const classes      = [];
  const objects      = [];
  const functions    = [];

  // Walk the AST and look for specific node types
  walk.simple(ast, {
    IfStatement(node) {
      ifStatements.push({
        type: "IfStatement",
        line: node.loc.start.line,
        column: node.loc.start.column
      });
    },

    ClassDeclaration(node) {
      // class MyClass { ... }
      classes.push({
        type: "ClassDeclaration",
        name: node.id ? node.id.name : null,
        line: node.loc.start.line,
        column: node.loc.start.column
      });
    },

    ClassExpression(node) {
      // const MyClass = class { ... }
      classes.push({
        type: "ClassExpression",
        name: node.id ? node.id.name : null,
        line: node.loc.start.line,
        column: node.loc.start.column
      });
    },

    ObjectExpression(node) {
      // object literal syntax: { key: value, ... }
      objects.push({
        type: "ObjectExpression",
        line: node.loc.start.line,
        column: node.loc.start.column,
        propertyCount: node.properties.length
      });
    },

    FunctionDeclaration(node) {
      functions.push({
        type: "FunctionDeclaration",
        name: node.id ? node.id.name : null,
        line: node.loc.start.line,
        column: node.loc.start.column
      });
    },

    FunctionExpression(node) {
      functions.push({
        type: "FunctionExpression",
        name: node.id ? node.id.name : null, // might be anonymous
        line: node.loc.start.line,
        column: node.loc.start.column
      });
    },

    ArrowFunctionExpression(node) {
      functions.push({
        type: "ArrowFunctionExpression",
        line: node.loc.start.line,
        column: node.loc.start.column
      });
    }
  });

  return { ifStatements, classes, objects, functions };
}

// Example usage:
const sampleCode = `
  if (true) {
    console.log("It's true!");
  }

  class MyClass {
    constructor() {
      this.value = 42;
    }
  }

  const obj = { foo: 'bar', baz: 123 };

  function myFunc() {
    return obj.baz;
  }

  const anotherFunc = function() {
    return "Hi!";
  };

  const arrow = () => console.log("Arrow function!");
`;

const analysisResult = analyzeJavaScript(sampleCode);
console.log("Analysis Result:", analysisResult);

