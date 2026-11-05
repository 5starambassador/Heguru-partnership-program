// Runs the production build with limits that fit hosts with low thread limits, such as Hostinger.
// Native modules start one thread per reported CPU unless these variables cap them.
import { spawnSync } from 'node:child_process'

const env = {
    ...process.env,
    NODE_ENV: 'production',
    TOKIO_WORKER_THREADS: '2',
    RAYON_NUM_THREADS: '2',
}

const steps = [
    ['node_modules/prisma/build/index.js', 'generate'],
    ['node_modules/next/dist/bin/next', 'build', '--webpack'],
]

for (const args of steps) {
    const { status, error } = spawnSync(process.execPath, args, { stdio: 'inherit', env })
    if (error) throw error
    if (status !== 0) process.exit(status ?? 1)
}
