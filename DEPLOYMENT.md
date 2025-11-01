# Deployment Guide

This guide covers the steps to build, test, and publish the Uplifty package to npm.

## Prerequisites

1. Node.js >= 14.0.0 installed
2. npm account created and logged in
3. Git repository properly configured
4. All code changes committed

## Pre-Publishing Checklist

Before publishing, ensure:

- [ ] All tests pass (if you have tests configured)
- [ ] Code is linted and follows style guidelines
- [ ] TypeScript compiles without errors
- [ ] README.md is up to date
- [ ] Version number is updated in `package.json`
- [ ] CHANGELOG is updated (if maintained)
- [ ] Git repository is clean (all changes committed)

## Building the Package

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Build the TypeScript code**:
   ```bash
   npm run build
   ```

   This compiles the TypeScript source from `src/` to JavaScript in `dist/`.

3. **Verify the build output**:
   - Check that `dist/` directory contains:
     - `index.js` and `index.d.ts`
     - `core/` directory with compiled files
     - `providers/` directory with compiled files
     - `types/` directory with compiled files

4. **Run linting** (optional but recommended):
   ```bash
   npm run lint
   ```

## Version Management

Update the version number in `package.json` according to [Semantic Versioning](https://semver.org/):

- **Patch version** (0.2.0 → 0.2.1): Bug fixes, minor patches
- **Minor version** (0.2.0 → 0.3.0): New features, backwards compatible
- **Major version** (0.2.0 → 1.0.0): Breaking changes

You can manually edit `package.json` or use npm version commands:

```bash
# Patch version
npm version patch

# Minor version
npm version minor

# Major version
npm version major
```

This will automatically:
- Update the version in `package.json`
- Create a git commit with the version change
- Create a git tag

## Testing Before Publishing

1. **Test locally** using the test UI:
   - Open `test/index.html` in a browser
   - Test with real AWS credentials
   - Verify uploads work correctly

2. **Test the package locally** (optional):
   ```bash
   npm pack
   ```
   This creates a `.tgz` file that you can install in another project to test:
   ```bash
   npm install /path/to/uplifty-0.2.0.tgz
   ```

## Publishing to npm

1. **Ensure you're logged in to npm**:
   ```bash
   npm login
   ```
   Enter your npm username, password, and email when prompted.

2. **Verify npm account**:
   ```bash
   npm whoami
   ```

3. **Publish the package**:
   ```bash
   npm run publish:npm
   ```

   Or directly:
   ```bash
   npm publish --registry=https://registry.npmjs.org/
   ```

   **Note**: The `publishConfig` in `package.json` ensures the package is published as public.

4. **Verify publication**:
   - Visit https://www.npmjs.com/package/uplifty
   - Check that the new version appears
   - Verify all files are included correctly

## Post-Publishing Steps

1. **Tag the release in Git** (if not done by npm version):
   ```bash
   git tag v0.2.0
   git push origin v0.2.0
   ```

2. **Push changes to GitHub**:
   ```bash
   git push origin main
   ```

3. **Create a GitHub release** (optional):
   - Go to your repository on GitHub
   - Navigate to Releases → Create a new release
   - Tag the version
   - Add release notes

## Troubleshooting

### Error: "You do not have permission to publish"

- Ensure you're logged in: `npm login`
- Check that the package name isn't already taken
- Verify your npm account has publishing rights

### Error: "Package version already exists"

- Update the version number in `package.json`
- Use `npm version patch/minor/major` to bump version

### Build errors

- Check TypeScript configuration
- Ensure all dependencies are installed
- Run `npm run build` to see specific error messages

### Missing files in published package

- Check the `files` field in `package.json`
- Ensure all necessary files are in the `dist/` directory
- Verify `README.md` and `LICENSE` are in the root

## Unpublishing (Emergency Only)

**Warning**: Unpublishing should be avoided if possible. Only do this for critical issues.

If you must unpublish:

```bash
npm unpublish uplifty@0.2.0
```

Note: npm has restrictions on unpublishing packages that are less than 72 hours old or have other packages depending on them.

## Package Distribution

The package will be available at:
- **npm**: https://www.npmjs.com/package/uplifty
- **Install command**: `npm install uplifty`

Users can import it as:
```javascript
import { Uplifty, StorageType } from 'uplifty';
```

