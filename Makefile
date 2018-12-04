all: WPEngineSaver.saver

WPEngineSaver.saver:
	xcodebuild -target Web -configuration Release

.PHONY: clean
clean:
	xcodebuild -target Web clean