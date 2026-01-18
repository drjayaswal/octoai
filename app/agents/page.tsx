import { Suspense } from 'react'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient, trpc } from '@/trpc/server'
import AgentsPage from './components/view'
import { Spinner } from '@/components/ui/spinner'

const Page = async () => {
    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({}))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<Spinner/>}>
                <AgentsPage />
            </Suspense>
        </HydrationBoundary>
    )
}

export default Page