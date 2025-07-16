import { createSignal, Show } from "solid-js";
import uuid from "uuid";
import { createRoom } from "../../Backend/Database/Create_Room";
import { Add_to_createdID } from "../../Backend/Database/Add_to_created_rooms";
import { userId } from "../../context/Userdetails";

export const CreateRoomModal = (props: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [name, setName] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [tagsInput, setTagsInput] = createSignal("");

  const handleSubmit = async () => {
    const tags = tagsInput()
      .split(" ")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    const id = await createRoom({
      Name: name(),
      Createdby: userId,
      Description: description(),
      Tags: tags,
    });

    if (id == null) {
      throw new Error("Room creation failed");
      props.onClose();
    } else {
      console.log("Room created with ID:", id);

      await Add_to_createdID({ UserId: userId }, { roomId: id });
      setName("");
      setDescription("");
      setTagsInput("");
      props.onClose();
    }
  };

  return (
    <Show when={props.isOpen}>
      <div class='fixed inset-0 bg-opacity-40 backdrop-blur-[2px] flex items-center justify-center z-[1000]'>
        <div class='bg-white p-6 rounded-lg shadow-md w-96 border border-gray-100'>
          <h2 class='text-xl font-semibold mb-4'>Create New Room</h2>
          <div class='space-y-4'>
            <input
              type='text'
              placeholder='Room Name'
              class='w-full px-4 py-2 border border-gray-300 rounded'
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
            />
            <textarea
              placeholder='Description'
              class='w-full px-4 py-2 border border-gray-300 rounded resize-none'
              value={description()}
              onInput={(e) => setDescription(e.currentTarget.value)}
              rows={3}
            />
            <input
              type='text'
              placeholder='Tags (separated by spaces)'
              class='w-full px-4 py-2 border border-gray-300 rounded'
              value={tagsInput()}
              onInput={(e) => setTagsInput(e.currentTarget.value)}
            />
          </div>
          <div class='mt-6 flex justify-end gap-3'>
            <button
              onClick={props.onClose}
              class='px-4 py-2 rounded bg-gray-200 hover:bg-gray-300'>
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              class='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700'>
              Create
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};
