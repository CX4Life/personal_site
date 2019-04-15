#!/usr/bin/env python3

import json
import os
import re
import string
from datetime import datetime

MARKDOWN_PATH = "./markdown"
JSON_PATH = "./json"


def files_in_path_matching_ext(path, ext):
    all_files = os.listdir(path)
    return list(filter(lambda x: x[(-1 * (len(ext))) :] == ext, all_files))


def filename_without_ext(filenames):
    return list(map(lambda filename: filename.split(".")[0], filenames))


def get_uncovererted_files():
    get_names_only = lambda path, ext: filename_without_ext(
        files_in_path_matching_ext(path, ext)
    )
    markdown_file_names = get_names_only("./markdown", ".md")
    json_file_names = get_names_only("./json", ".json")
    return list(
        filter(
            lambda markdown_file_name: markdown_file_name not in json_file_names,
            markdown_file_names,
        )
    )


def title_from_filename(filename):
    ret = ""
    for char in filename:
        if char in string.ascii_uppercase:
            ret += f" {char}"
        else:
            ret += char
    return ret


def convert_markdown_to_body(markdown_filename):
    with open(markdown_filename, "r") as input_file:
        contents = input_file.read()

    return re.sub(r"(?<!\n)\n(?!\n)", " ", contents)


def create_json_file(filename, contents):
    file_with_path_and_ext = os.path.join(JSON_PATH, filename + ".json")
    with open(file_with_path_and_ext, "w") as output_file:
        json.dump(contents, output_file, indent=2)


def main():
    files_to_convert = get_uncovererted_files()
    for file in files_to_convert:
        file_dict = {}
        file_dict["title"] = title_from_filename(file)
        file_dict["created_on"] = datetime.now().isoformat()

        filename_with_path_and_ext = os.path.join(MARKDOWN_PATH, file + ".md")
        file_dict["body"] = convert_markdown_to_body(filename_with_path_and_ext)
        create_json_file(file, file_dict)


if __name__ == "__main__":
    main()
