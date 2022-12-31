#include <emscripten/bind.h>
#include "kanaval/kanaval.hpp"
#include <string>
#include "H5Cpp.h"

void validate(std::string path, bool embed, int version) {
    H5::H5File handle(path, H5F_ACC_RDONLY);
    kanaval::validate(handle, embed, version);
    return;
}

EMSCRIPTEN_BINDINGS(kana_validate) {
   emscripten::function("validate", &validate);
}
