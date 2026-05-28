'use client'

import { wagmiAdapter, projectId, networks } from '../web3/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { useMemo, type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

// Set up metadata
const metadata = {
  name: 'church.ai',
  description: 'Church AI',
  url: 'https://8clever.github.io/', // origin must match your domain & subdomain
  icons: []
}

const [ defaultNetwork, ...otherNetworks ] = networks

export function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  useMemo(() => createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [ defaultNetwork, ...otherNetworks ],
    defaultNetwork: defaultNetwork,
    metadata: metadata,
    features: {
      analytics: false
    }
  }), []);
  
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}