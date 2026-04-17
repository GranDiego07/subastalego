// hooks/useAuctionChannel.js
import { useEffect, useRef, useCallback } from 'react';
import * as Ably from 'ably';

const ABLY_KEY = import.meta.env.VITE_ABLY_API_KEY;

/**
 * Hook que se suscribe al canal de una subasta en Ably.
 * Escucha eventos: new-bid, auction-closed
 *
 * @param {number|string} auctionId  - ID de la subasta
 * @param {object}        callbacks  - { onNewBid, onAuctionClosed }
 */
export function useAuctionChannel(auctionId, { onNewBid, onAuctionClosed } = {}) {
    const clientRef  = useRef(null);
    const channelRef = useRef(null);

    const cleanup = useCallback(() => {
        if (channelRef.current) {
            channelRef.current.unsubscribe();
            channelRef.current = null;
        }
        if (clientRef.current) {
            clientRef.current.close();
            clientRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (!auctionId) return;

        const client  = new Ably.Realtime({ key: ABLY_KEY });
        const channel = client.channels.get(`auction-${auctionId}`);

        clientRef.current  = client;
        channelRef.current = channel;

        // Evento: nueva puja
        if (onNewBid) {
            channel.subscribe('new-bid', (msg) => {
                onNewBid(msg.data);
            });
        }

        // Evento: subasta cerrada
        if (onAuctionClosed) {
            channel.subscribe('auction-closed', (msg) => {
                onAuctionClosed(msg.data);
            });
        }

        return cleanup;
    }, [auctionId]);

    return { cleanup };
}
