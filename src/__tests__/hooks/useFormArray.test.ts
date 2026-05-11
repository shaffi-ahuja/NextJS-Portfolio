/**
 * useFormArray Hook Tests
 * Place at: src/__tests__/hooks/useFormArray.test.ts
 */

import { renderHook, act } from '@testing-library/react';
import { useFormArray } from '@/hooks/useFormArray';

describe('useFormArray Hook', () => {
  interface TestItem {
    id: number;
    name: string;
    value?: string;
  }

  test('should initialize with provided items', () => {
    const initialItems: TestItem[] = [{ id: 1, name: 'Item 1' }];
    const { result } = renderHook(() => useFormArray(initialItems));

    expect(result.current.items).toEqual(initialItems);
  });

  test('should add new item', () => {
    const { result } = renderHook(() => useFormArray<TestItem>([]));

    act(() => {
      result.current.add({ id: 1, name: 'New Item' });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual({ id: 1, name: 'New Item' });
  });

  test('should add multiple items', () => {
    const { result } = renderHook(() => useFormArray<TestItem>([]));

    act(() => {
      result.current.add({ id: 1, name: 'Item 1' });
      result.current.add({ id: 2, name: 'Item 2' });
      result.current.add({ id: 3, name: 'Item 3' });
    });

    expect(result.current.items).toHaveLength(3);
  });

  test('should remove item by index', () => {
    const initial: TestItem[] = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ];
    const { result } = renderHook(() => useFormArray(initial));

    act(() => {
      result.current.remove(1);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.items).toEqual([
      { id: 1, name: 'Item 1' },
      { id: 3, name: 'Item 3' },
    ]);
  });

  test('should remove first item', () => {
    const initial: TestItem[] = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];
    const { result } = renderHook(() => useFormArray(initial));

    act(() => {
      result.current.remove(0);
    });

    expect(result.current.items).toEqual([{ id: 2, name: 'Item 2' }]);
  });

  test('should remove last item', () => {
    const initial: TestItem[] = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];
    const { result } = renderHook(() => useFormArray(initial));

    act(() => {
      result.current.remove(1);
    });

    expect(result.current.items).toEqual([{ id: 1, name: 'Item 1' }]);
  });

  test('should update item field', () => {
    const initial: TestItem[] = [
      { id: 1, name: 'Old Name', value: 'old' },
    ];
    const { result } = renderHook(() => useFormArray(initial));

    act(() => {
      result.current.update(0, 'name', 'New Name');
    });

    expect(result.current.items[0].name).toBe('New Name');
    expect(result.current.items[0].id).toBe(1);
    expect(result.current.items[0].value).toBe('old');
  });

  test('should update multiple fields', () => {
    const initial: TestItem[] = [{ id: 1, name: 'Item', value: 'old' }];
    const { result } = renderHook(() => useFormArray(initial));

    act(() => {
      result.current.update(0, 'name', 'Updated');
      result.current.update(0, 'value', 'new');
    });

    expect(result.current.items[0]).toEqual({
      id: 1,
      name: 'Updated',
      value: 'new',
    });
  });

  test('should maintain immutability', () => {
    const initial: TestItem[] = [{ id: 1, name: 'Original' }];
    const { result } = renderHook(() => useFormArray(initial));
    const originalRef = result.current.items;

    act(() => {
      result.current.update(0, 'name', 'Modified');
    });

    expect(result.current.items).not.toBe(originalRef);
    expect(initial[0].name).toBe('Original'); // Original shouldn't change
  });

  test('should setItems directly', () => {
    const initial: TestItem[] = [{ id: 1, name: 'Item' }];
    const { result } = renderHook(() => useFormArray(initial));

    const newItems: TestItem[] = [
      { id: 2, name: 'New Item 1' },
      { id: 3, name: 'New Item 2' },
    ];

    act(() => {
      result.current.setItems(newItems);
    });

    expect(result.current.items).toEqual(newItems);
  });

  test('should handle empty array operations', () => {
    const { result } = renderHook(() => useFormArray<TestItem>([]));

    expect(result.current.items).toHaveLength(0);

    act(() => {
      result.current.remove(0); // Should not crash
    });

    expect(result.current.items).toHaveLength(0);
  });

  test('should handle add then remove', () => {
    const { result } = renderHook(() => useFormArray<TestItem>([]));

    act(() => {
      result.current.add({ id: 1, name: 'Item' });
      result.current.add({ id: 2, name: 'Item 2' });
      result.current.remove(0);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe(2);
  });

  test('should preserve order during operations', () => {
    const { result } = renderHook(() => useFormArray<TestItem>([]));

    act(() => {
      result.current.add({ id: 1, name: 'A' });
      result.current.add({ id: 2, name: 'B' });
      result.current.add({ id: 3, name: 'C' });
      result.current.remove(1); // Remove B
      result.current.add({ id: 4, name: 'D' });
    });

    expect(result.current.items.map(i => i.id)).toEqual([1, 3, 4]);
  });

  test('should handle complex object updates', () => {
    interface ComplexItem {
      id: number;
      nested: { title: string; description: string };
    }

    const initial: ComplexItem[] = [
      {
        id: 1,
        nested: { title: 'Old', description: 'Old desc' },
      },
    ];

    const { result } = renderHook(() => useFormArray(initial));

    act(() => {
      result.current.update(0, 'nested', {
        title: 'New',
        description: 'New desc',
      });
    });

    expect(result.current.items[0].nested).toEqual({
      title: 'New',
      description: 'New desc',
    });
  });
});
