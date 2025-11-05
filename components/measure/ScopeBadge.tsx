type Props = { scope: string[], and?: string }

const ScopeBadge = ({ scope, and = 'and' }: Props) => {
  const formatScope = (scope: string[]): string => {
    if (scope.length === 1) {
      return scope[0];
    } else if (scope.length === 2) {
      return `${scope[0]} ${and} ${scope[1].replace('Scope', '').trim()}`;
    } else {
      const allButLast = scope.slice(0, -1).map((item, index) => index === 0 ? item : item.replace('Scope', '').trim()).join(', ');
      const last = scope[scope.length - 1].replace('Scope', '').trim();
      return `${allButLast} ${and} ${last}`;
    }
  };

  return (
    <span className="w-auto h-auto py-1 px-2 bg-[#f4f4f4] text-neutral-500 text-xs rounded">
      { formatScope(scope) }
    </span>
  )
}

export default ScopeBadge
