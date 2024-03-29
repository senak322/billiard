import React, { useRef, useEffect, useState } from "react";
import type { Ball } from "../../types/types";
import ContextMenu from "../ContextMenu/ContextMenu";

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [balls, setBalls] = useState<Ball[]>([
    { x: 100, y: 100, radius: 20, color: "red", velocityX: 0, velocityY: 0 },
    { x: 200, y: 100, radius: 20, color: "blue", velocityX: 0, velocityY: 0 },
  ]); // Массив шаров
  const [selectedBall, setSelectedBall] = useState<Ball | null>(null); // Выбранный шар для контекстного меню

  useEffect(() => {
    // Инициализация игры, создание шаров и т.д.

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!context) {
      return;
    }

    // Функция отрисовки шаров
    const drawBalls = () => {
      context.clearRect(0, 0, canvas!.width, canvas!.height); // Очищаем холст перед каждой отрисовкой

      balls.forEach((ball) => {
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
        context.fillStyle = ball.color;
        context.fill();
      });
    };

    drawBalls(); // Отрисовываем начальное состояние шаров

    const update = () => {
      setBalls((balls) =>
        balls.map((ball) => {
          // Обновление позиции
          let newX = ball.x + ball.velocityX;
          let newY = ball.y + ball.velocityY;

          // Проверка столкновений со стенками и изменение направления/скорости
          if (
            newX < ball.radius ||
            newX > canvasRef.current!.width - ball.radius
          ) {
            ball.velocityX *= -1;
          }
          if (
            newY < ball.radius ||
            newY > canvasRef.current!.height - ball.radius
          ) {
            ball.velocityY *= -1;
          }

          return { ...ball, x: newX, y: newY };
        })
      );

      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }, [balls]);

  const handleCanvasClick = (event: React.MouseEvent) => {
    event.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const clickedBall = balls.find((ball) => {
      const distance = Math.sqrt(
        Math.pow(ball.x - mouseX, 2) + Math.pow(ball.y - mouseY, 2)
      );
      return distance < ball.radius;
    });

    if (clickedBall) {
      setSelectedBall(clickedBall);
    } else {
      setSelectedBall(null);
    }
  };

  const handleCanvasMouseDown = (event: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Находим шар, ближайший к точке клика
    const clickedBall = balls.find((ball) => {
      const distance = Math.sqrt(
        Math.pow(ball.x - mouseX, 2) + Math.pow(ball.y - mouseY, 2)
      );
      return distance < ball.radius;
    });

    if (clickedBall) {
      // Создаем новый массив шаров с обновленными значениями для выбранного шара
      const newBalls = balls.map((ball) => {
        if (ball === clickedBall) {
          return {
            ...ball,
            velocityX: ball.velocityX + (mouseX - ball.x) * 0.1,
            velocityY: ball.velocityY + (mouseY - ball.y) * 0.1,
          };
        }
        return ball;
      });

      setBalls(newBalls);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleCanvasMouseDown}
        onClick={handleCanvasClick}
        width={800}
        height={600}
      ></canvas>
      {selectedBall && (
        <ContextMenu
          ball={selectedBall}
          onClose={() => setSelectedBall(null)}
        />
      )}
    </div>
  );
};

export default Game;
