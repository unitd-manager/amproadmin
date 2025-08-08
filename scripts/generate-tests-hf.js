const fs = require('fs');
const path = require('path');

const testsDir = path.join(__dirname, '..', '__tests__');
const testFilePath = path.join(testsDir, 'dummy.test.js');

const testContent = `
test('dummy test', () => {
  expect(true).toBe(true);
});
`;

if (!fs.existsSync(testsDir)) {
  fs.mkdirSync(testsDir, { recursive: true });
}

fs.writeFileSync(testFilePath, testContent.trim());

console.log('Dummy test file created at __tests__/dummy.test.js');
