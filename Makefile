test:
	@ DEBUG=app:test ./node_modules/.bin/mocha test/**/*-test.js --opts test/mocha.opts

.PHONY: test