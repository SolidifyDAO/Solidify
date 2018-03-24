
# default target does nothing
.DEFAULT_GOAL: default
default: ;

# add truffle and ganache to $PATH
export PATH := ./node_modules/.bin:$(PATH)

test:
			truffle compile
			truffle migrate
			truffle test test/testAddMember.js
			rm build/contracts/*
			truffle migrate
			truffle test test/testVoteProposal.js
.PHONY: test
				#xcodebuild test -project KinSDK/KinSDK.xcodeproj \
				#-scheme KinTestHost \
				#-sdk iphonesimulator \
				#-destination 'platform=iOS Simulator,name=iPhone 6'

prepare-tests: truffle
		scripts/prepare-tests.sh
.PHONY: prepare-tests

truffle: ganache truffle-clean
				scripts/truffle.sh
.PHONY: truffle

truffle-clean:
				rm -f truffle/token-contract-address

ganache: ganache-run  # alias for ganache-run
.PHONY: ganache
ganache-run: ganache-kill
				scripts/ganache-run.sh
.PHONY: ganache-run

ganache-kill:
				scripts/ganache-kill.sh
.PHONY: ganache-kill

clean: truffle-clean ganache-kill
				rm -f truffle/truffle.log
				rm -f truffle/ganache.log
.PHONY: clean
