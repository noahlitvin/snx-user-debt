import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import Chart from '../components/chart'
import {
  Container,
  Heading,
  Switch,
  FormControl,
  FormLabel,
  Flex,
  Box,
  Input,
} from '@chakra-ui/react'
import {
  createQueryContext,
  SynthetixQueryContextProvider,
} from '@synthetixio/queries'
import { QueryClient, QueryClientProvider } from 'react-query'
const qc = new QueryClient()

const Home: NextPage = () => {
  const [showL2, setShowL2] = useState<boolean>(false)
  const [address, setAddress] = useState('')

  return (
    <div>
      <Head>
        <title>Synthetix User Debt</title>
      </Head>
      <QueryClientProvider client={qc}>
        <SynthetixQueryContextProvider
          value={createQueryContext({
            networkId: showL2 ? 10 : 1,
          })}
        >
          <Container maxW="container.xl">
            <Flex mt={12} mb={10} alignItems="center">
              <Box>
                <Heading fontWeight="thin" letterSpacing={1}>
                  Synthetix Debt Overview
                </Heading>
              </Box>
              <Box flex="1" px={10}>
                <Input
                  value={address}
                  borderColor={address.length == 0 ? 'green.700' : undefined}
                  onChange={(e) => setAddress(e.target.value)}
                  width={412}
                  placeholder="Enter a wallet address here..."
                />
              </Box>
              <Box>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="network" mb="0">
                    L1
                  </FormLabel>
                  <Switch
                    isChecked={showL2}
                    onChange={() => setShowL2(!showL2)}
                    id="network"
                  />
                  <FormLabel htmlFor="network" mb="0" ml={2.5}>
                    L2
                  </FormLabel>
                </FormControl>
              </Box>
            </Flex>
            <Chart address={address} network={showL2 ? 'L2' : 'L1'} />
          </Container>
        </SynthetixQueryContextProvider>
      </QueryClientProvider>
    </div>
  )
}

export default Home
