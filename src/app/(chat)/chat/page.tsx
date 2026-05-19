"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";

import { socket } from "@/lib/socket";

interface UserType {
  _id: string;
  username: string;
  email: string;
}

interface MessageType {
  _id?: string;
  text: string;
  image?: string;
  createdAt?: string;
  sender: UserType;
  receiver: UserType;
}

export default function ChatPage() {
  const { data: session } = useSession();

  const currentUserId = (session?.user as any)?.id;

  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] =
    useState<UserType | null>(null);

  const [messages, setMessages] = useState<MessageType[]>([]);

  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUser, setTypingUser] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] =
    useState(false);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");

      const data = await res.json();

      const filteredUsers = data.filter(
        (user: UserType) =>
          user._id !== currentUserId
      );

      setUsers(filteredUsers);

      if (filteredUsers.length > 0) {
        setSelectedUser(filteredUsers[0]);
      }
    };

    if (currentUserId) {
      fetchUsers();

      socket.emit("join", currentUserId);
    }
  }, [currentUserId]);

  // Fetch Messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;

      const res = await fetch(
        `/api/messages?sender=${currentUserId}&receiver=${selectedUser._id}`
      );

      const data = await res.json();

      setMessages(data);
    };

    fetchMessages();
  }, [selectedUser, currentUserId]);

  // Realtime Messages
  useEffect(() => {
    socket.on(
      "receive-message",
      (newMessage: MessageType) => {
        if (
          newMessage.sender._id ===
            selectedUser?._id ||
          newMessage.receiver._id ===
            selectedUser?._id
        ) {
          setMessages((prev) => [
            ...prev,
            newMessage,
          ]);
        }
      }
    );

    return () => {
      socket.off("receive-message");
    };
  }, [selectedUser]);

  // Online Users
  useEffect(() => {
    socket.on(
      "online-users",
      (users: string[]) => {
        setOnlineUsers(users);
      }
    );

    return () => {
      socket.off("online-users");
    };
  }, []);

  // Typing Indicator
  useEffect(() => {
    socket.on(
      "user-typing",
      (username: string) => {
        setTypingUser(username);

        setTimeout(() => {
          setTypingUser("");
        }, 2000);
      }
    );

    return () => {
      socket.off("user-typing");
    };
  }, []);

  // Upload Image
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const res = await fetch("/api/upload", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          image: reader.result,
        }),
      });

      const data = await res.json();

      setImage(data.url);
    };
  };

  // Emoji
  const handleEmojiClick = (
    emojiData: any
  ) => {
    setMessage(
      (prev) => prev + emojiData.emoji
    );
  };

  // Send Message
  const sendMessage = async () => {
    if (
      (!message.trim() && !image) ||
      !selectedUser
    )
      return;

    const res = await fetch("/api/messages", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        sender: currentUserId,
        receiver: selectedUser._id,
        text: message,
        image,
      }),
    });

    const newMessage = await res.json();

    socket.emit(
      "send-message",
      newMessage
    );

    setMessages((prev) => [
      ...prev,
      newMessage,
    ]);

    setMessage("");
    setImage("");
  };

  return (
    <main className="flex h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <aside className="w-80 border-r border-zinc-800 bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-800 p-4">
          <div>
            <h1 className="text-2xl font-bold">
              Chats
            </h1>

            <p className="text-sm text-zinc-400">
              {session?.user?.name}
            </p>
          </div>

          <button
            onClick={() => signOut()}
            className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold transition hover:bg-red-400"
          >
            Logout
          </button>
        </div>

        <div className="overflow-y-auto">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() =>
                setSelectedUser(user)
              }
              className={`cursor-pointer border-b border-zinc-800 p-4 transition hover:bg-zinc-800 ${
                selectedUser?._id ===
                user._id
                  ? "bg-zinc-800"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold">
                    {user.username
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold">
                      {user.username}
                    </p>

                    <p className="text-sm text-zinc-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                {onlineUsers.includes(
                  user._id
                ) && (
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <section className="flex flex-1 flex-col">
        {/* Header */}
        <div className="border-b border-zinc-800 p-4">
          {selectedUser ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold">
                {selectedUser.username
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h2 className="font-semibold">
                  {selectedUser.username}
                </h2>

                {onlineUsers.includes(
                  selectedUser._id
                ) && (
                  <p className="text-sm text-green-400">
                    Online
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-zinc-500">
              Select a conversation
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          {messages.length === 0 &&
            selectedUser && (
              <div className="flex h-full items-center justify-center">
                <p className="text-zinc-500">
                  Start your conversation 👋
                </p>
              </div>
            )}

          {messages.map((msg, index) => {
            const isCurrentUser =
              msg.sender._id ===
              currentUserId;

            return (
              <div
                key={index}
                className={`flex ${
                  isCurrentUser
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs rounded-2xl px-4 py-3 shadow-lg transition hover:scale-[1.02] ${
                    isCurrentUser
                      ? "bg-blue-600"
                      : "bg-zinc-800"
                  }`}
                >
                  {!isCurrentUser && (
                    <p className="mb-1 text-xs font-semibold text-zinc-300">
                      {
                        msg.sender
                          .username
                      }
                    </p>
                  )}

                  {msg.text && (
                    <p>{msg.text}</p>
                  )}

                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Uploaded"
                      className="mt-2 max-h-64 rounded-xl"
                    />
                  )}

                  <p className="mt-2 text-right text-xs text-zinc-300">
                    {msg.createdAt
                      ? new Date(
                          msg.createdAt
                        ).toLocaleTimeString(
                          [],
                          {
                            hour:
                              "2-digit",
                            minute:
                              "2-digit",
                          }
                        )
                      : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Typing */}
        {typingUser && (
          <p className="px-6 pb-2 text-sm text-zinc-400">
            {typingUser} is typing...
          </p>
        )}

        {/* Input */}
        {selectedUser && (
          <div className="border-t border-zinc-800 p-4">
            <div className="relative flex items-center gap-3">
              {/* Emoji Button */}
              <button
                onClick={() =>
                  setShowEmojiPicker(
                    !showEmojiPicker
                  )
                }
                className="rounded-xl bg-zinc-800 p-4 hover:bg-zinc-700"
              >
                <Smile size={20} />
              </button>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-20 left-0 z-50">
                  <EmojiPicker
                    onEmojiClick={
                      handleEmojiClick
                    }
                  />
                </div>
              )}

              {/* Upload */}
              <label className="cursor-pointer rounded-xl bg-zinc-800 px-4 py-3 hover:bg-zinc-700">
                📎

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageUpload
                  }
                  className="hidden"
                />
              </label>

              {/* Input */}
              <input
                type="text"
                placeholder="Type message..."
                className="flex-1 rounded-xl bg-zinc-800 p-4 outline-none"
                value={message}
                onChange={(e) => {
                  setMessage(
                    e.target.value
                  );

                  socket.emit(
                    "typing",
                    session?.user
                      ?.name ||
                      "Someone"
                  );
                }}
              />

              {/* Send */}
              <button
                onClick={sendMessage}
                className="rounded-xl bg-blue-600 px-6 py-4 font-semibold transition hover:bg-blue-500"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}