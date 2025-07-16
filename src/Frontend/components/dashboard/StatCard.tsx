export const StatCard = (props: {
  title: string;
  value: number;
  icon: any;
  color: string;
}) => (
  <div class='bg-white rounded-lg p-6 shadow-sm border border-gray-200'>
    <div class='flex items-center justify-between'>
      <div>
        <p class='text-sm text-gray-600'>{props.title}</p>
        <p class='text-2xl font-semibold text-gray-900'>{props.value}</p>
      </div>
      <div class={`p-3 rounded-full ${props.color}`}>{props.icon}</div>
    </div>
  </div>
);
