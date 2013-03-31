REPORTER = spec
TESTS = $(shell find test -name "test*.js")

test:
	@./node_modules/.bin/mocha -G --reporter $(REPORTER) $(TESTS)

watch:
	@./node_modules/.bin/mocha -w -G --reporter $(REPORTER) $(TESTS)

cov: lib-cov
	@TEST_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@jscoverage lib lib-cov

.PHONY: test test-cov watch