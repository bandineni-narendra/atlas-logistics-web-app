const fs = require('fs');
const path = require('path');

const colorMap = {
    // Primaries
    '--primary': 'primary',
    '--primary-hover': 'primary-hover',
    '--primary-container': 'primary-soft',
    '--on-primary': 'white',
    '--on-primary-container': 'primary',

    // Secondary/Tertiary mapping
    '--secondary-container': 'primary-soft',
    '--on-secondary-container': 'primary',
    '--tertiary-container': 'surface',
    '--on-tertiary-container': 'textPrimary',

    // Surfaces
    '--surface': 'surface',
    '--surface-dim': 'surface',
    '--surface-container-lowest': 'background',
    '--surface-container-low': 'surface',
    '--surface-container': 'surface',
    '--surface-container-high': 'surface',
    '--surface-variant': 'surface',

    // On Surfaces (Text)
    '--on-surface': 'textPrimary',
    '--on-surface-variant': 'textSecondary',

    // Borders (Outline)
    '--outline': 'border',
    '--outline-variant': 'border',

    // Status
    '--error': 'error',
    '--error-container': 'error',
    '--on-error': 'white',
    '--on-error-container': 'white',

    '--success': 'success',
    '--success-container': 'success',
    '--on-success-container': 'white',

    '--warning': 'warning',
    '--warning-container': 'warning',
    '--on-warning-container': 'white',

    // Elevation mapped to Tailwind tokens
    '--elevation-0': 'none',
    '--elevation-1': 'sm',
    '--elevation-2': 'md',
    '--elevation-3': 'lg'
};

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    let changedFilesCount = 0;

    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            changedFilesCount += processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;

            const newContent = content.replace(/([a-zA-Z:-]+)-\[var\((--[a-zA-Z0-9-]+)\)\]/g, (match, prefix, cssVar) => {
                const mappedTheme = colorMap[cssVar];
                if (mappedTheme) {
                    changed = true;
                    return `${prefix}-${mappedTheme}`;
                }
                return match;
            });

            if (changed) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                changedFilesCount++;
                console.log(`Updated ${fullPath}`);
            }
        }
    }
    return changedFilesCount;
}

const count = processDirectory(path.join(process.cwd(), 'src'));
console.log(`Total files updated: ${count}`);
