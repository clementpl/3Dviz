# Settings
SRC_FOLDER=./src
BUILD_FOLDER=./build
TEST_FOLDER=./test
NM_FOLDER=./node_modules

# Complete build
#all: deps dist buildcss build
all: build compile


# Prepare build folder
build:
	rm -rf $(BUILD_FOLDER)
	mkdir $(BUILD_FOLDER)
	mkdir $(BUILD_FOLDER)/css/
	cp $(SRC_FOLDER)/*.html $(BUILD_FOLDER)/
	cp -r $(SRC_FOLDER)/img $(BUILD_FOLDER)/
#	cp -r $(SRC_FOLDER)/data $(BUILD_FOLDER)/

# Install dependencies
deps:
	npm install


# Compile CSS
#buildcss:
#	$(NM_FOLDER)/npm-css/bin/npm-css $(SRC_FOLDER)/css/myriad.css > $(BUILD_FOLDER)/myriad.css

# Compile JS
compile:
	$(NM_FOLDER)/browserify/bin/cmd.js $(SRC_FOLDER)/js/main.js -t [ babelify --presets [ es2015 ] ] --debug --s M > $(BUILD_FOLDER)/3Dviz.js
	$(NM_FOLDER)/stylus/bin/stylus $(SRC_FOLDER)/css/main.styl --out $(BUILD_FOLDER)/css/

# Watch for JS and CSS change
watch:
	$(NM_FOLDER)/stylus/bin/stylus --watch $(SRC_FOLDER)/css/main.styl --out $(BUILD_FOLDER)/css/ &
	$(NM_FOLDER)/watchify/bin/cmd.js $(SRC_FOLDER)/js/main.js -t [ babelify --presets [ es2015 ] ] --debug --s M -o $(BUILD_FOLDER)/3Dviz.js

# Test
#test:
#	$(NM_FOLDER)/browserify/bin/cmd.js --debug $(TEST_FOLDER)/js/*.js > $(TEST_FOLDER)/tests.js


# Clean
clean:
	rm -rf $(BUILD_FOLDER)
#	rm -f $(TEST_FOLDER)/tests.js

# Clean and remake
re: clean all
