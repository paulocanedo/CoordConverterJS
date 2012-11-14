JAVA_BIN='/home/paulocanedo/custom/lib/jre1.7.0_07/bin/java';
COMPRESSOR='/home/paulocanedo/Downloads/builder/componentbuild/lib/yuicompressor/yuicompressor-2.4.2.jar';
FULL_JS_FILE='dist/CoordConverter-full.js';
MIN_JS_FILE='dist/CoordConverter-min.js';

rm $FULL_JS_FILE
rm $MIN_JS_FILE
cat src/*.js > $FULL_JS_FILE

$JAVA_BIN -jar $COMPRESSOR $FULL_JS_FILE -o $MIN_JS_FILE


#for file in '*.js'
#    do
#        if "$file" != "$FULL_JS_FILE"
#            "$JAVA_BIN -jar $file -o $MIN_JS_FILE";
#        fi
#    done

