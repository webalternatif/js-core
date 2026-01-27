export default {
    testEnvironment: 'jsdom',
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    moduleFileExtensions: ['js'],
    coverageReporters: ['text', 'lcov', 'html'],
    roots: [
        '<rootDir>/tests',
        '<rootDir>/src'
    ],
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/index.js',
        '!tests/**/*.js'
    ],
    transform: {
        '^.+\\.js$': [
            'babel-jest', {
                presets: [
                    ['@babel/preset-env', { targets: { node: 'current' } }]
                ]
            }
        ]
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
