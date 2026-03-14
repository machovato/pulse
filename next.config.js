const { execSync } = require('child_process');

let commitCount = '0';
let commitHash = 'dev';
let syncStatus = '';

try {
    commitCount = execSync('git rev-list --count HEAD').toString().trim();
    commitHash = execSync('git log -n 1 --format="%h"').toString().trim();

    // Only check sync status during local development
    if (process.env.NODE_ENV !== 'production') {
        const isDirty = execSync('git status --porcelain').toString().trim().length > 0;

        // Check ahead/behind counts against remote
        let aheadCount = 0;
        let behindCount = 0;
        try {
            execSync('git fetch origin');
            const branchTrack = execSync('git rev-list --left-right --count HEAD...@{u}').toString().trim();
            const parts = branchTrack.split('\t');
            if (parts.length === 2) {
                aheadCount = parseInt(parts[0], 10);
                behindCount = parseInt(parts[1], 10);
            }
        } catch (fetchErr) {
            // Ignore fetch errors (e.g., no internet or not tracking upstream)
        }

        if (isDirty) syncStatus += ' [Uncommitted]';
        if (behindCount > 0) syncStatus += ` [Forgot to Pull (${behindCount})]`;
        if (aheadCount > 0) syncStatus += ` [Forgot to Push (${aheadCount})]`;
    }
} catch (e) {
    console.warn('Could not determine git version', e);
}

// Fallback for non-git environments (e.g. fresh clone before first commit)
const finalHash = commitHash;

const envSuffix = process.env.NODE_ENV === 'production' ? '' : '-local';
const appVersion = `v1.0.${commitCount}${envSuffix} (${finalHash})${syncStatus}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    env: {
        NEXT_PUBLIC_APP_VERSION: appVersion,
    },
};

module.exports = nextConfig;
