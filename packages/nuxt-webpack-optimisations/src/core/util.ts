import type { Augmentation, PolicyResponse } from '../types'

export const defineAugmentation = (augmentation: Augmentation) => augmentation

export const deny = (reason: string): PolicyResponse => ({ forward: 'deny', reason })
