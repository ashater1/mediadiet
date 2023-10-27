export default function asyncIterableToStream(
  asyncIterable: AsyncIterable<Uint8Array>
) {
  return new ReadableStream({
    async pull(conroller) {
      for await (const entry of asyncIterable) {
        conroller.enqueue(entry);
      }
      conroller.close();
    },
  });
}
