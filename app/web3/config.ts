'use client'

import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, mainnet } from '@reown/appkit/networks'

// Get projectId from https://dashboard.reown.com
export const projectId = "4e58e2cb72163596d5acf75da3209b6d"
export const networks = [ mainnet, base ]
export const owner = "0x773a8Bc80506e42cD7f1f3858E197004EB558076"

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: false,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig