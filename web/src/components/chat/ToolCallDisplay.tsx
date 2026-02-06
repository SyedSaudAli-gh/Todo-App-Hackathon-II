import { ToolCall } from '@/types/chat';

interface ToolCallDisplayProps {
  toolCalls: ToolCall[];
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * ToolCallDisplay Component
 * T082-T085: Collapsible display of AI tool calls
 */
export function ToolCallDisplay({ toolCalls, isExpanded, onToggle }: ToolCallDisplayProps) {
  return (
    <div className="mt-2 border-t border-gray-300 pt-2">
      {/* T083: Collapsible toggle button */}
      <button
        onClick={onToggle}
        className="text-xs text-blue-600 hover:underline focus:outline-none"
      >
        {isExpanded ? 'Hide' : 'View'} tool calls ({toolCalls.length})
      </button>

      {/* T084: Tool call details display */}
      {isExpanded && (
        <div className="mt-2 space-y-2">
          {toolCalls.map((call, index) => (
            <div key={index} className="bg-white p-2 rounded text-xs border border-gray-200">
              <p className="font-semibold text-gray-700">{call.tool_name}</p>
              {/* T085: Format JSON arguments and results readably */}
              <div className="mt-1 space-y-1">
                <p className="text-gray-600">
                  <span className="font-medium">Args:</span>{' '}
                  <code className="bg-gray-100 px-1 rounded">
                    {JSON.stringify(call.arguments, null, 2)}
                  </code>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Result:</span>{' '}
                  <code className="bg-gray-100 px-1 rounded">
                    {JSON.stringify(call.result, null, 2)}
                  </code>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
