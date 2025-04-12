<?php

namespace App\Enums;

enum Planos: int
{
    case MENSAL = 30;
    case TRIMESTRAL = 90;
    case SEMESTRAL = 180;
    case ANUAL = 365;

}