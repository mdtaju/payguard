const MessagePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) => {
  const { message } = await searchParams;

  return (
    <main className="px-4 py-6">
      <div className="bg-accent custom_shadow p-4 rounded-md w-full max-w-[600px] mx-auto text-center">
        <h1 className="text-2xl font-semibold">Welcome Again 🖐</h1>
        <p className="mt-4 text-3xl md:text-4xl font-medium">{message}</p>
      </div>
    </main>
  );
};

export default MessagePage;
