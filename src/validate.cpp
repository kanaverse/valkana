#include <emscripten/bind.h>
#include "kanaval/validate.hpp"
#include <cstdint>
#include "H5Cpp.h"

void validate(std::string path, bool embed, int version) {
    H5::H5File handle(path, H5F_ACC_RDONLY);
    kanaval::validate(handle, embed, version);
    return;
}

void validate_inputs(std::string path, bool embed, int version) {
    H5::H5File handle(path, H5F_ACC_RDONLY);
    kanaval::inputs::validate(handle, embed, version);
    return;
}

void validate_quality_control(std::string path, int num_cells, int num_samples, int version) {
    H5::H5File handle(path, H5F_ACC_RDONLY);
    kanaval::quality_control::validate(handle, num_cells, num_samples, version);
    return;
}

void validate_adt_quality_control(std::string path, int num_cells, int num_samples, bool adt_in_use, int version) {
    H5::H5File handle(path, H5F_ACC_RDONLY);
    kanaval::adt_quality_control::validate(handle, num_cells, num_samples, adt_in_use, version);
    return;
}

void validate_combine_embeddings(std::string path, int num_cells, int num_modalities, uintptr_t modalities_str, uintptr_t modalities_len, int total_dims, int version) {
    auto ptr = reinterpret_cast<const char*>(modalities_str);
    auto len = reinterpret_cast<const int32_t*>(modalities_len);

    std::vector<std::string> modalities;
    modalities.reserve(num_modalities);
    for (int l = 0; l < num_modalities; ++l) {
        modalities.emplace_back(ptr, ptr + len[l]);
        ptr += len[l];
    }

    H5::H5File handle(path, H5F_ACC_RDONLY);
    kanaval::combine_embeddings::validate(handle, num_cells, modalities, total_dims, version);
    return;
}

EMSCRIPTEN_BINDINGS(kana_validate) {
   emscripten::function("validate", &validate);
   emscripten::function("validate_inputs", &validate_inputs);
   emscripten::function("validate_quality_control", &validate_quality_control);
   emscripten::function("validate_adt_quality_control", &validate_adt_quality_control);
   emscripten::function("validate_combine_embeddings", &validate_combine_embeddings);
}
