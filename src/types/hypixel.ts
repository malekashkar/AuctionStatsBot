export interface ItemBytes {
    type: number
    data: string
}

export interface Bid {
    auction_id: string
    bidder: string
    profile_id: string
    amount: number
    timestamp: number
}

export interface Auction {
    _id: string
    uuid: string
    auctioneer: string
    profile_id: string
    coop: string[]
    start: number
    end: number
    item_name: string
    item_lore: string
    extra: string
    category: string
    tier: string
    starting_bid: number
    item_bytes: ItemBytes
    claimed: boolean
    claimed_bidders: string[]
    highest_bid_amount: number
    bids: Bid[]
}

export interface AuctionResponse {
    success: boolean
    page: number
    totalPages: number
    totalAuctions: number
    lastUpdated: number
    auctions: Auction[]
}

export interface EndedAuction {
    auction_id: string
    seller: string
    seller_profile: string
    buyer: string
    timestamp: number
    price: number
    bin: boolean
    item_bytes: string
}

export interface EndedAuctionsResponse {
    success: boolean
    lastUpdated: number
    auctions: EndedAuction[]
}