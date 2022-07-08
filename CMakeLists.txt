cmake_minimum_required(VERSION 3.14)

project(valkana_wasm
    VERSION 1.0.0
    DESCRIPTION "Validating the bakana analysis output files"
    LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)

add_subdirectory(extern)

add_executable(
    valkana_wasm 
    src/validate.cpp
    src/get_error_message.cpp
)

target_compile_options(
    valkana_wasm PUBLIC -O3 -fexceptions
)

target_link_libraries(
    valkana_wasm
    kanaval
    hdf5-wasm-cpp
)

set_target_properties(valkana_wasm PROPERTIES 
    OUTPUT_NAME valkana
    LINK_FLAGS "-O3 --bind -fexceptions -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB -s USE_ZLIB=1 -s MODULARIZE=1 -s EXPORT_NAME=loadValkana -s EXPORT_ES6"
)

set(COMPILE_NODE OFF CACHE BOOL "Compile for Node.js")
if (COMPILE_NODE)
    # Using the Node FS API for HDF5 access.
    set_property(TARGET valkana_wasm APPEND APPEND_STRING PROPERTY LINK_FLAGS " -s ENVIRONMENT=node -s NODERAWFS=1 -s FORCE_FILESYSTEM=1")

    add_custom_command(TARGET valkana_wasm POST_BUILD
        COMMAND cat ../misc/preamble.js valkana.js > tmp.js
        COMMAND mv tmp.js valkana.js
        WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}
        COMMENT "Adding ES6 preamble for Node"
    )
else ()
    # Forcing filesystem inclusion for HDF5.
    set_property(TARGET valkana_wasm APPEND APPEND_STRING PROPERTY LINK_FLAGS " -s ENVIRONMENT=web,worker -s FORCE_FILESYSTEM=1 -s 'EXPORTED_RUNTIME_METHODS=[\"FS\"]'")
endif()
