import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App.jsx";

afterEach(() => {
  cleanup();
});

// T-1 / B-1 / I-1 / I-3: App renders exactly the literal greeting text,
// with exact case/punctuation, no props, no state.
describe("App (T-1, B-1, I-1, I-3)", () => {
  it("renders exactly 'Hello, World!' as text content", () => {
    render(<App />);
    expect(screen.getByText("Hello, World!")).toBeInTheDocument();
  });

  it("does not render case-mutated or punctuation-stripped variants (I-1, DI-1/DI-5 guard)", () => {
    render(<App />);
    expect(screen.queryByText("hello, world!")).not.toBeInTheDocument();
    expect(screen.queryByText("Hello World")).not.toBeInTheDocument();
  });

  it("renders no additional unexpected sibling text content (O-6)", () => {
    const { container } = render(<App />);
    expect(container.textContent).toBe("Hello, World!");
  });
});

// I-2: rendered output is deterministic across repeated renders (no randomization,
// no date/time, no external dependency).
describe("App determinism (I-2)", () => {
  it("renders identical text content across repeated mounts", () => {
    const first = render(<App />);
    const firstText = first.container.textContent;
    first.unmount();

    const second = render(<App />);
    const secondText = second.container.textContent;
    second.unmount();

    expect(firstText).toBe("Hello, World!");
    expect(secondText).toBe("Hello, World!");
  });
});

// B-3 / T-5: dispatching representative input events after mount causes no visible
// change; absence of state change is the correct behavior.
describe("App input stability (B-3, T-5)", () => {
  it("leaves text content unchanged after keyboard and click events", () => {
    const { container } = render(<App />);
    const before = container.textContent;
    const nodeCountBefore = container.querySelectorAll("*").length;

    const target = container.firstElementChild ?? container;
    fireEvent.keyDown(target, { key: "a" });
    fireEvent.keyPress(target, { key: "a" });
    fireEvent.click(target);

    expect(container.textContent).toBe(before);
    expect(container.textContent).toBe("Hello, World!");
    expect(container.querySelectorAll("*").length).toBe(nodeCountBefore);
  });
});
