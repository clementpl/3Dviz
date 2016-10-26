# Settings
SRC_FOLDER=./src
DIST_FOLDER=./dist
TEST_FOLDER=./test
NM_FOLDER=./node_modules

# Complete build
all: deps dist buildcss build


# Prepare dist folder
dist:
	rm -rf $(DIST_FOLDER)
	mkdir $(DIST_FOLDER)
	cp $(SRC_FOLDER)/*.html $(DIST_FOLDER)/
	cp -r $(SRC_FOLDER)/data $(DIST_FOLDER)/
	cp -r $(SRC_FOLDER)/img $(DIST_FOLDER)/

# Install dependencies
deps:
	npm install


# Compile CSS
buildcss:
	$(NM_FOLDER)/npm-css/bin/npm-css $(SRC_FOLDER)/css/myriad.css > $(DIST_FOLDER)/myriad.css

# Compile JS
build:
	$(NM_FOLDER)/browserify/bin/cmd.js $(SRC_FOLDER)/js/main.js --debug --s M > $(DIST_FOLDER)/myriad.js

# Watch
watch:
	$(NM_FOLDER)/watchify/bin/cmd.js $(SRC_FOLDER)/js/main.js --debug --s M -o $(DIST_FOLDER)/myriad.js

# Test
test:
	$(NM_FOLDER)/browserify/bin/cmd.js --debug $(TEST_FOLDER)/js/*.js > $(TEST_FOLDER)/tests.js


# Clean
clean:
	rm -rf $(DIST_FOLDER)
	rm -f $(TEST_FOLDER)/tests.js

# Clean and remake
re: clean all
