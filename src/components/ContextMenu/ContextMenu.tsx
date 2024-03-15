import type { Ball } from '../../types/types';

interface ContextMenuProps {
    ball: Ball;
    onClose: () => void;
  }
  
  const ContextMenu: React.FC<ContextMenuProps> = ({ ball, onClose }) => {
    // Реализация UI контекстного меню для изменения свойств шара
    return (
      <div style={{ position: 'absolute', left: '100px', top: '100px' }}> {/* Замените координаты на актуальные */}
        <div>Цвет шара: {ball.color}</div>
        {/* Кнопки или селекторы для изменения цвета */}
      </div>
    );
  };

  export default ContextMenu;