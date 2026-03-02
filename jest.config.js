export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    moduleFileExtensions: ['ts', 'js'],
    coverageReporters: ['text', 'lcov', 'html'],
    roots: ['<rootDir>/tests', '<rootDir>/src'],
    collectCoverageFrom: ['src/**/*.{ts,js}', '!src/index.ts', '!src/index.js', '!tests/**/*'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '^.+\\.js$': [
            'babel-jest',
            {
                presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
            },
        ],
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}
