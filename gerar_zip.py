"""Gera um arquivo ZIP do projeto respeitando os .gitignore do repositório."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / f"4cores-{ROOT.name}.zip"
EXCLUDED_DIRS = {
    ".git",
    "node_modules",
    "dist",
    "build",
    "coverage",
    ".cache",
    ".vite",
    "__pycache__",
}


def ignored(paths: list[Path]) -> set[str]:
    relative = [path.relative_to(ROOT).as_posix() for path in paths]
    try:
        result = subprocess.run(
            ["git", "check-ignore", "--no-index", "--stdin", "-z"],
            cwd=ROOT,
            input="\0".join(relative) + "\0",
            text=True,
            capture_output=True,
            check=False,
        )
    except (FileNotFoundError, OSError):
        return set()
    return {item for item in result.stdout.split("\0") if item}


def main() -> int:
    candidates = [
        path
        for path in ROOT.rglob("*")
        if path.is_file()
        and path != OUTPUT
        and not any(part in EXCLUDED_DIRS for part in path.parts)
    ]
    ignored_paths = ignored(candidates)
    with ZipFile(OUTPUT, "w", ZIP_DEFLATED) as archive:
        for path in candidates:
            relative = path.relative_to(ROOT).as_posix()
            if relative in ignored_paths and not path.name.endswith(".env.example"):
                continue
            if path.name == ".env" or (
                path.name.startswith(".env.") and not path.name.endswith(".example")
            ):
                continue
            archive.write(path, relative)
    print(f"ZIP criado: {OUTPUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
