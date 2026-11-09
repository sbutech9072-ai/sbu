"""
Interactive Terminal CLI for SBU TECH AI Assistant.
Allows chatting with the AI directly from the command line.
"""

import sys
from pathlib import Path

# Ensure root workspace is in sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from ai.llm import generate_grounded_answer


def main():
    print("=" * 65)
    print("🤖 SBU TECH AI Assistant — Interactive Terminal Chat")
    print("   Type your question in Bangla or English.")
    print("   Type 'exit' or 'quit' to end the session.")
    print("=" * 65)

    history = []

    while True:
        try:
            user_input = input("\nYou: ").strip()
            if not user_input:
                continue
            if user_input.lower() in ("exit", "quit", "q"):
                print("\nGoodbye! Session ended.")
                break

            print("\nAI is thinking...")
            resp = generate_grounded_answer(
                question=user_input,
                conversation_history=history,
            )

            print(f"\nAI: {resp.answer}")

            # Display verified sources if available
            if resp.sources:
                print("\n📚 Verified Sources:")
                for src in resp.sources:
                    print(f"   • [{src.get('chunk_id')}] Page {src.get('page_number')}: {src.get('section_title')}")

            # Append to conversation history
            history.append({"role": "user", "content": user_input})
            history.append({"role": "assistant", "content": resp.answer})

        except KeyboardInterrupt:
            print("\nSession interrupted. Exiting.")
            break
        except Exception as e:
            print(f"\nError: {e}")


if __name__ == "__main__":
    main()

