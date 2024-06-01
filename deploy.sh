npm run build
git add dist
git commit -m "rebuilt project"
git subtree push --prefix dist origin gh-pages
