import React from "react";

export function PasswordInput({ ...props }: React.PropsWithChildren) {
  return (
    <div>
      <input {...props} />;
    </div>
  );
}
