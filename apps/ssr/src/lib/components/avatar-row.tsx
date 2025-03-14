import { Avatar, AvatarFallback } from "~/lib/components/ui/avatar";

const AvatarRow = () => {
  return (
    <div className="flex -space-x-4">
      <Avatar className="border-2 border-background w-10 h-10">
        <AvatarFallback className="bg-orange-200 text-orange-800">JD</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background w-10 h-10">
        <AvatarFallback className="bg-emerald-200 text-emerald-800">MJ</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background w-10 h-10">
        <AvatarFallback className="bg-blue-200 text-blue-800">RK</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background w-10 h-10">
        <AvatarFallback className="bg-purple-200 text-purple-800">AL</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background w-10 h-10">
        <AvatarFallback className="bg-gray-200 text-gray-800">TS</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background w-10 h-10">
        <AvatarFallback className="bg-pink-200 text-pink-800">NP</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default AvatarRow;
