import { createSignal, For } from "solid-js";
import { FiX, FiFile, FiCheck, FiChevronDown } from "solid-icons/fi";

export default function CreateFileModal(props: any) {
  const { isOpen, onClose, onCreateFile, languages } = props;

  const [name, setName] = createSignal("");
  const [selectedLang, setSelectedLang] = createSignal(languages?.[0] || null);
  const [showLanguageDropdown, setShowLanguageDropdown] = createSignal(false);
  const [error, setError] = createSignal("");

  const confirm = () => {
    const fileName = name().trim();
    const language = selectedLang()?.name;

    if (!fileName) {
      setError("File name is required");
      return;
    }

    if (!language) {
      setError("Please select a language");
      return;
    }

    // Call onCreateFile with fileName and language
    onCreateFile(fileName, language);

    // Reset and close
    setName("");
    setSelectedLang(languages?.[0] || null);
    setError("");
    setShowLanguageDropdown(false);
    onClose();
  };

  const handleClose = () => {
    setName("");
    setSelectedLang(languages?.[0] || null);
    setError("");
    setShowLanguageDropdown(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div class='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div class='bg-white rounded-lg p-6 w-full max-w-md shadow-xl'>
        <div class='flex justify-between items-center mb-4'>
          <h2 class='text-lg font-bold'>Create New File</h2>
          <button onClick={handleClose} class='p-1 hover:bg-gray-100 rounded'>
            <FiX class='text-gray-500' />
          </button>
        </div>

        <div class='mb-4'>
          <label class='block text-sm font-medium text-gray-700 mb-1'>
            File Name
          </label>
          <input
            type='text'
            class='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500'
            placeholder='Enter file name'
            value={name()}
            onInput={(e) => setName(e.target.value)}
            autofocus
          />
          {error() && <p class='text-red-500 text-sm mt-1'>{error()}</p>}
        </div>

        <div class='mb-6'>
          <label class='block text-sm font-medium text-gray-700 mb-1'>
            Language
          </label>
          <div class='relative'>
            <button
              type='button'
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown())}
              class='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between bg-white'>
              <span class='text-gray-700'>
                {selectedLang()?.name || "Select a language"}
              </span>
              <FiChevronDown
                class={`text-gray-500 transition-transform ${
                  showLanguageDropdown() ? "rotate-180" : ""
                }`}
              />
            </button>

            {showLanguageDropdown() && (
              <div class='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto'>
                <For each={languages}>
                  {(lang) => (
                    <button
                      type='button'
                      class='w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-700'
                      onClick={() => {
                        setSelectedLang(lang);
                        setShowLanguageDropdown(false);
                      }}>
                      {lang.name}
                    </button>
                  )}
                </For>
              </div>
            )}
          </div>
        </div>

        <div class='flex justify-end gap-2'>
          <button
            class='px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm'
            onClick={handleClose}>
            Cancel
          </button>
          <button
            class='px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm'
            onClick={confirm}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
