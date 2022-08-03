import { useRef, useState } from "react";

type Props = {
  children: any;
};

export const ResizableBox = ({ children }: Props) => {
  const [initPos, setInitPos] = useState(undefined);
  const [initSize, setInitSize] = useState<number | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);

  const initial = (e: any) => {
    setInitPos(e.clientX);
    setInitSize(ref.current?.offsetWidth);
  };

  const resize = (e: any) => {
    ref.current!.style.width = `${initSize} + ${e.clientX - initPos!}px`;
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div ref={ref}>{children}</div>
      <div
        draggable
        onDragStart={initial}
        onDrag={resize}
        style={{
          width: 20,
          height: 20,
          background: "black",
          cursor: "col-resize",
        }}
      />
    </div>
  );
};
