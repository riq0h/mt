# mtt(multitool)

A multi-tool that performs various operations on files within a directory. Currently, it supports the following features.

## Usage

`npm insatll -g @riq0h/mtt`

## `mtt -r`

Bulk renames filenames within a directory. When launched, `$EDITOR` is called, allowing you to flexibly edit with any editor.

## `mtt -c`

Compresses individual files within a directory. If no filenames are specified, all files will be targeted.

## `mtt -i <files...> -p <value>`

Resizes image files (`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`) within a directory. The `-p` option is required to specify the resize ratio.
